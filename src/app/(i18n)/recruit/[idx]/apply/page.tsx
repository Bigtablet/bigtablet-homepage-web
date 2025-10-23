"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Template from "src/components/common/template";
import { useRecruitApply } from "src/hooks/recruit/useRecruit";
import { useGcpUpload } from "src/hooks/gcp/useGcp";
import {
    ApplyEducationLevel,
    ApplyMilitaryStatus,
    RecruitRequest,
} from "src/types/recruit/recruit.type";
import { sendEmailApi, checkEmailApi } from "src/api/email/email.api";
import "./style.scss";

/* ---------------------------------------
 * Constants
 * ------------------------------------- */
const EMAIL_RESEND_COOLDOWN = 60; // 이메일 재전송 대기(초)

/* ---------------------------------------
 * Type Guards / Mappers
 * ------------------------------------- */
const isEdu = (v: string): v is ApplyEducationLevel =>
    v === ApplyEducationLevel.GED ||
    v === ApplyEducationLevel.HIGH_SCHOOL ||
    v === ApplyEducationLevel.ASSOCIATE ||
    v === ApplyEducationLevel.BACHELOR;

const mapEdu = (v: string): ApplyEducationLevel =>
    isEdu(v) ? v : ApplyEducationLevel.BACHELOR;

// 서버 enum과 UI 값 매핑
const mapMil = (v: string): ApplyMilitaryStatus => {
    if (v === "DONE") return ApplyMilitaryStatus.COMPLETED;
    if (v === "PENDING") return ApplyMilitaryStatus.NOT_COMPLETED;
    if (v === "EXEMPT" || v === "") return ApplyMilitaryStatus.NOT_APPLICABLE;
    if (
        v === ApplyMilitaryStatus.COMPLETED ||
        v === ApplyMilitaryStatus.NOT_COMPLETED ||
        v === ApplyMilitaryStatus.NOT_APPLICABLE
    )
        return v as ApplyMilitaryStatus;
    return ApplyMilitaryStatus.NOT_APPLICABLE;
};

// YYYY-MM (기본값: 현재년-월)
const currentYearMonth = () => {
    const d = new Date();
    const m = `${d.getMonth() + 1}`.padStart(2, "0");
    return `${d.getFullYear()}-${m}`;
};

/* ---------------------------------------
 * UI State
 * ------------------------------------- */
type UIState = {
    isVeteranTarget: boolean;
    isDisabilityTarget: boolean;

    // 이메일/인증
    email: string;
    authCode: string;
    emailSent: boolean;
    emailVerified: boolean;
    sendLoading: boolean;
    checkLoading: boolean;
    resendSec: number;

    // 학력/링크/파일
    eduLevel: ApplyEducationLevel;
    photoPreview: string;
    portfolioName: string;
    coverLetterName: string;
    disabilityFileName: string;
    link1: string;
    link2: string;
    link3: string;
};

const ApplyPage = () => {
    const { locale, idx } = useParams<{ locale: string; idx: string }>();
    const router = useRouter();
    const jobId = useMemo(() => Number(idx) || -1, [idx]);

    const [ui, setUi] = useState<UIState>({
        isVeteranTarget: false,
        isDisabilityTarget: false,

        email: "",
        authCode: "",
        emailSent: false,
        emailVerified: false,
        sendLoading: false,
        checkLoading: false,
        resendSec: 0,

        eduLevel: ApplyEducationLevel.BACHELOR,
        photoPreview: "",
        portfolioName: "",
        coverLetterName: "",
        disabilityFileName: "",
        link1: "",
        link2: "",
        link3: "",
    });

    const setPartial = (patch: Partial<UIState>) => setUi((s) => ({ ...s, ...patch }));

    const { upload, isPending: isUploading } = useGcpUpload();
    const { submit, isPending: isSubmitting } = useRecruitApply({
        onSuccess: () => {
            alert("지원서가 성공적으로 제출되었습니다.");
            router.push(`/recruit/${idx}`);
        },
        onError: (err) => {
            alert(`제출 실패: ${err.message}`);
        },
    });

    /* ---------------------------------------
     * Helpers
     * ------------------------------------- */
    const uploadIfPresent = async (fileLike: FormDataEntryValue | null): Promise<string> => {
        const f = fileLike as File | null;
        if (!f || !f.size) return "";
        const url = await upload(f);
        return url ?? "";
    };

    const safeGet = (fd: FormData, name: string) => String(fd.get(name) || "").trim();

    /* ---------------------------------------
     * Handlers
     * ------------------------------------- */
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        // 파일 제거
        if (!file) {
            if (ui.photoPreview) URL.revokeObjectURL(ui.photoPreview);
            setPartial({ photoPreview: "" });
            return;
        }

        // PNG만 허용
        if (file.type !== "image/png") {
            alert("PNG 파일만 가능합니다.");
            e.currentTarget.value = "";
            if (ui.photoPreview) URL.revokeObjectURL(ui.photoPreview);
            setPartial({ photoPreview: "" });
            return;
        }

        // 미리보기 갱신
        const url = URL.createObjectURL(file);
        if (ui.photoPreview) URL.revokeObjectURL(ui.photoPreview);
        setPartial({ photoPreview: url });
    };

    // 파일명 표시 업데이트
    const handleDocName =
        (key: keyof UIState) =>
            (e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                setPartial({ [key]: file?.name ?? "" } as Partial<UIState>);
            };

    // 링크 입력 업데이트
    const handleLink =
        (key: "link1" | "link2" | "link3") =>
            (e: React.ChangeEvent<HTMLInputElement>) => {
                setPartial({ [key]: e.target.value });
            };

    // 이메일 전송
    const handleSendEmail = async () => {
        if (!ui.email) return alert("이메일을 입력해주세요.");
        if (ui.resendSec > 0) return alert(`${ui.resendSec}초 후 재전송 가능합니다.`);

        setPartial({ sendLoading: true, emailSent: false, emailVerified: false });
        try {
            await sendEmailApi(ui.email);
            setPartial({ emailSent: true, resendSec: EMAIL_RESEND_COOLDOWN });
            alert("인증 코드가 전송되었습니다. 메일함을 확인해주세요.");
        } catch (error: any) {
            alert(error?.response?.data?.message || "이메일 전송 중 오류가 발생했습니다.");
        } finally {
            setPartial({ sendLoading: false });
        }
    };

    // 이메일 인증 확인
    const handleCheckEmail = async () => {
        if (!ui.email || !ui.authCode) return alert("이메일과 인증 코드를 모두 입력해주세요.");

        setPartial({ checkLoading: true });
        try {
            await checkEmailApi(ui.email, ui.authCode);
            setPartial({ emailVerified: true });
            alert("이메일 인증이 완료되었습니다.");
        } catch (error: any) {
            setPartial({ emailVerified: false });
            alert(error?.response?.data?.message || "이메일 인증 중 오류가 발생했습니다.");
        } finally {
            setPartial({ checkLoading: false });
        }
    };

    // 폼 제출
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!Number.isFinite(jobId) || jobId <= 0) {
            alert("유효하지 않은 공고입니다.");
            return;
        }

        const fd = new FormData(e.currentTarget);
        const educationLevel = ui.eduLevel;
        const military = mapMil(safeGet(fd, "military"));

        try {
            // 업로드(있으면)
            const photoUrl = await uploadIfPresent(fd.get("photo"));
            const portfolioUrl = await uploadIfPresent(fd.get("portfolio"));
            const coverLetterUrl = await uploadIfPresent(fd.get("coverletter"));
            const disabilityFileUrl = await uploadIfPresent(fd.get("disabilityFile"));

            // 첨부 링크(최대 3) + 장애 서류를 우선순위로 섞어 3개까지만 배치
            const rawLinks = [
                safeGet(fd, "attachmentLink1"),
                safeGet(fd, "attachmentLink2"),
                safeGet(fd, "attachmentLink3"),
            ].filter(Boolean);

            const ordered: string[] = [];
            if (disabilityFileUrl) ordered.push(disabilityFileUrl);
            for (const link of rawLinks) ordered.push(link);
            const [attachment1 = "", attachment2 = "", attachment3 = ""] = ordered;

            // GED일 경우 학교/기간/학과는 공란, 기간 기본값은 현재년-월
            const isGed = educationLevel === ApplyEducationLevel.GED;

            const payload: RecruitRequest = {
                jobId,
                name: safeGet(fd, "name"),
                phoneNumber: safeGet(fd, "phone"),
                email: safeGet(fd, "email"),
                address: safeGet(fd, "address1"),
                addressDetail: safeGet(fd, "address2"),
                portfolio: portfolioUrl,
                coverLetter: coverLetterUrl,
                profileImage: photoUrl,
                educationLevel,
                schoolName: isGed ? "" : safeGet(fd, "eduSchool"),
                admissionYear: isGed ? currentYearMonth() : safeGet(fd, "eduStart"),
                graduationYear: isGed ? currentYearMonth() : safeGet(fd, "eduEnd"),
                department: isGed ? "" : safeGet(fd, "eduMajor"),
                military,
                attachment1,
                attachment2,
                attachment3,
            };

            submit(payload);
        } catch {
            alert("파일 업로드 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    /* ---------------------------------------
     * Effects
     * ------------------------------------- */
    // 컴포넌트 언마운트 시 미리보기 URL 해제
    useEffect(() => {
        return () => {
            if (ui.photoPreview) URL.revokeObjectURL(ui.photoPreview);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 이메일 변경 시 쿨다운/보냄상태 초기화
    useEffect(() => {
        setUi((s) => ({ ...s, resendSec: 0, emailSent: false }));
    }, [ui.email]);

    // 1초 카운트다운
    useEffect(() => {
        if (ui.resendSec <= 0) return;
        const id = setInterval(() => {
            setUi((s) => ({ ...s, resendSec: Math.max(0, s.resendSec - 1) }));
        }, 1000);
        return () => clearInterval(id);
    }, [ui.resendSec]);

    /* ---------------------------------------
     * Render
     * ------------------------------------- */
    return (
        <Template>
            <div className="apply">
                <h1 className="apply__title">지원서 작성</h1>

                <form className="apply__form" noValidate onSubmit={onSubmit}>
                    <div className="apply__grid">
                        {/* 좌측 폼 */}
                        <div className="apply__left">
                            <div className="field">
                                <label>이름*</label>
                                <input name="name" placeholder="홍길동" required />
                            </div>

                            <div className="field">
                                <label>전화번호*</label>
                                <input name="phone" placeholder="010-1234-1234" required />
                                <label className="checkbox">
                                    <input type="checkbox" name="isForeignResident" /> 현재 외국 거주 중
                                </label>
                            </div>

                            <div className="field">
                                <label>이메일*</label>
                                <div className="row gap8">
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="example@email.com"
                                        value={ui.email}
                                        onChange={(e) => setPartial({ email: e.target.value })}
                                        required
                                    />
                                    <input
                                        name="authCode"
                                        placeholder="인증코드"
                                        value={ui.authCode}
                                        onChange={(e) => setPartial({ authCode: e.target.value })}
                                    />

                                    {/* 전송 버튼 (쿨다운/로딩 반영) */}
                                    <button
                                        type="button"
                                        className="btn ghost"
                                        onClick={handleSendEmail}
                                        disabled={ui.sendLoading || !ui.email || ui.resendSec > 0}
                                    >
                                        {ui.sendLoading
                                            ? "전송 중..."
                                            : ui.resendSec > 0
                                                ? `재전송 ${ui.resendSec}s`
                                                : "전송"}
                                    </button>

                                    {/* 확인 버튼 */}
                                    <button
                                        type="button"
                                        className="btn ghost"
                                        onClick={handleCheckEmail}
                                        disabled={ui.checkLoading || !ui.email || !ui.authCode}
                                    >
                                        {ui.checkLoading ? "확인 중..." : "확인"}
                                    </button>
                                </div>

                                {/* 라이브 영역(스크린리더용) */}
                                <small className="help" aria-live="polite">
                                    {ui.emailVerified
                                        ? "이메일 인증이 완료되었습니다."
                                        : ui.emailSent
                                            ? ui.resendSec > 0
                                                ? `이메일로 전송된 인증 코드를 입력 후 확인을 눌러주세요. (재전송 ${ui.resendSec}s)`
                                                : "이메일로 전송된 인증 코드를 입력 후 확인을 눌러주세요."
                                            : "이메일 인증 부탁드립니다"}
                                </small>
                            </div>

                            <div className="field">
                                <label>거주지</label>
                                <input name="address1" placeholder="서울특별시 중구 세종대로 110" />
                                <input name="address2" placeholder="상세주소" />
                            </div>

                            <div className="field">
                                <label>
                                    포트폴리오 / 이력서* <span className="sub">PDF 파일만 업로드 가능합니다.</span>
                                </label>
                                <div className="file">
                                    <input
                                        id="portfolio"
                                        name="portfolio"
                                        type="file"
                                        accept="application/pdf"
                                        className="visually-hidden"
                                        onChange={handleDocName("portfolioName")}
                                        required
                                    />
                                    <label htmlFor="portfolio" className="file__trigger">
                                        파일 선택
                                    </label>
                                    <span className="file__name">{ui.portfolioName || "선택된 파일 없음"}</span>
                                </div>
                            </div>

                            <div className="field">
                                <label>
                                    자기소개서 <span className="sub">PDF 파일만 업로드 가능합니다.</span>
                                </label>
                                <div className="file">
                                    <input
                                        id="coverletter"
                                        name="coverletter"
                                        type="file"
                                        accept="application/pdf"
                                        className="visually-hidden"
                                        onChange={handleDocName("coverLetterName")}
                                    />
                                    <label htmlFor="coverletter" className="file__trigger">
                                        파일 선택
                                    </label>
                                    <span className="file__name">{ui.coverLetterName || "선택된 파일 없음"}</span>
                                </div>
                            </div>

                            <div className="field">
                                <label>최종 학력*</label>
                                <div className="row gap8">
                                    <select
                                        name="eduLevel"
                                        value={ui.eduLevel}
                                        onChange={(e) => setPartial({ eduLevel: mapEdu(e.target.value) })}
                                        required
                                    >
                                        <option value={ApplyEducationLevel.GED}>검정고시</option>
                                        <option value={ApplyEducationLevel.HIGH_SCHOOL}>고등학교 졸업</option>
                                        <option value={ApplyEducationLevel.ASSOCIATE}>전문대학 졸업</option>
                                        <option value={ApplyEducationLevel.BACHELOR}>대학교 (4년제) 졸업</option>
                                    </select>

                                    {ui.eduLevel !== ApplyEducationLevel.GED && (
                                        <input name="eduSchool" placeholder="학교명" />
                                    )}
                                </div>

                                {ui.eduLevel !== ApplyEducationLevel.GED && (
                                    <>
                                        <div className="row gap8">
                                            <input name="eduStart" type="month" placeholder="입학년도(YYYY-MM)" />
                                            <input name="eduEnd" type="month" placeholder="졸업년도(YYYY-MM)" />
                                        </div>
                                        <input name="eduMajor" placeholder="계열 (학과)" />
                                    </>
                                )}
                            </div>

                            <div className="field">
                                <label>병역 사항</label>
                                <select name="military" defaultValue="">
                                    <option value="" disabled>
                                        병역 사항 선택
                                    </option>
                                    <option value="DONE">군필</option>
                                    <option value="EXEMPT">면제</option>
                                    <option value="PENDING">미필</option>
                                </select>
                            </div>

                            <div className="field">
                                {ui.isDisabilityTarget && (
                                    <>
                                        <div className="row gap8">
                                            <input name="disabilityDesc" placeholder="장애 내용" />
                                            <select name="disabilityLevel" defaultValue="">
                                                <option value="" disabled>
                                                    장애 정도
                                                </option>
                                                <option value="light">경증</option>
                                                <option value="medium">중등도</option>
                                                <option value="severe">중증</option>
                                            </select>
                                        </div>
                                        <div className="row gap8">
                                            <div className="file">
                                                <input
                                                    id="disabilityFile"
                                                    name="disabilityFile"
                                                    type="file"
                                                    className="visually-hidden"
                                                    onChange={handleDocName("disabilityFileName")}
                                                />
                                                <label htmlFor="disabilityFile" className="file__trigger">
                                                    파일 선택
                                                </label>
                                                <span className="file__name">
                          {ui.disabilityFileName || "선택된 파일 없음"}
                        </span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="field">
                                <label>
                                    첨부 자료 <span className="sub">링크 3개까지 입력 가능 (GitHub, Notion 등)</span>
                                </label>
                                <div className="stack">
                                    <input
                                        name="attachmentLink1"
                                        type="url"
                                        placeholder="https://github.com/username/repo"
                                        value={ui.link1}
                                        onChange={handleLink("link1")}
                                        inputMode="url"
                                        pattern="https?://.*"
                                    />
                                    <input
                                        name="attachmentLink2"
                                        type="url"
                                        placeholder="https://www.notion.so/..."
                                        value={ui.link2}
                                        onChange={handleLink("link2")}
                                        inputMode="url"
                                        pattern="https?://.*"
                                    />
                                    <input
                                        name="attachmentLink3"
                                        type="url"
                                        placeholder="https://portfolio.site/..."
                                        value={ui.link3}
                                        onChange={handleLink("link3")}
                                        inputMode="url"
                                        pattern="https?://.*"
                                    />
                                </div>
                                <small className="help">http(s)로 시작하는 전체 URL을 입력해 주세요.</small>
                            </div>

                            <div className="notice">
                                <p>다음의 경우에 해당될 시, 채용 절차가 중단되거나 입사가 철회될 수 있습니다:</p>
                                <ul>
                                    <li>지원서 관련하여 허위 작성이나 부정확한 요청을 한 경우</li>
                                    <li>국내·해외 또는 해외 여행에 결격 사유가 있는 경우</li>
                                    <li>규정상 직무 수행이 불가능하거나, 사실 확인 과정에서 중대한 문제가 발견된 경우</li>
                                </ul>
                            </div>

                            <button className="apply__submit" type="submit" disabled={isSubmitting || isUploading}>
                                {isSubmitting || isUploading ? "제출 중..." : "제출하기"}
                            </button>
                            <p className="apply__footer">기타 채용 관련 문의사항은 recruit@bigtablet.com 으로 연락 바랍니다</p>
                        </div>

                        {/* 우측 프로필 사진 */}
                        <div className="apply__right">
                            <label>프로필 사진*</label>
                            <div className="photo">
                                <label className="photo__box">
                                    <input
                                        name="photo"
                                        type="file"
                                        accept="image/png"
                                        hidden
                                        onChange={handlePhotoChange}
                                    />
                                    {ui.photoPreview ? (
                                        <img src={ui.photoPreview} alt="프로필 미리보기" className="photo__img" />
                                    ) : (
                                        <span>+</span>
                                    )}
                                </label>

                                {ui.photoPreview && (
                                    <button
                                        type="button"
                                        className="btn ghost"
                                        onClick={() => {
                                            if (ui.photoPreview) URL.revokeObjectURL(ui.photoPreview);
                                            setPartial({ photoPreview: "" });
                                            const input = document.querySelector<HTMLInputElement>('input[name="photo"]');
                                            if (input) input.value = "";
                                        }}
                                    >
                                        제거
                                    </button>
                                )}

                                <p>PNG 파일만 업로드 가능합니다.</p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </Template>
    );
};

export default ApplyPage;