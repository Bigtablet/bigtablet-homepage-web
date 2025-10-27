"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Template from "src/components/common/template";
import { useRecruitApply } from "src/hooks/recruit/useRecruit";
import { useGcpUpload } from "src/hooks/gcp/useGcp";
import {
    ApplyEducationLevel,
    type RecruitRequest,
    type RecruitFormData,
    type ApplyDegreeDetail,
    type Gender,
    toRecruitRequestPayload,
} from "src/types/recruit/recruit.type";
import { sendEmailApi, checkEmailApi } from "src/api/email/email.api";

import EmailVerifier from "src/components/recruit/email";
import EducationFields from "src/components/recruit/education";
import MilitarySelect from "src/components/recruit/military";
import PhotoUploader from "src/components/recruit/photo";
import FilePicker from "src/components/recruit/file";
import {
    handlePhoneMask010,
    mapMil,
    parseYM,
    safeGet,
    isEduAllowed,
    NAME_KO_REGEX,
    MIN_EDU_LEVEL,
    normalizeMilitaryByGender,
} from "src/components/recruit/validators";

import "./style.scss";

type UIState = {
    email: string;
    authCode: string;
    emailSent: boolean;
    emailVerified: boolean;
    sendLoading: boolean;
    checkLoading: boolean;
    resendSec: number;

    eduLevel: ApplyEducationLevel;     // 서버용(계약 유지) — BACHELOR 고정 운용
    degreeDetail: ApplyDegreeDetail;   // UI 표기용(학사/석사/박사)
    gender: Gender;                    // 병역 로직 보조(서버 미전송)

    photoPreview: string;
    portfolioName: string;
    coverLetterName: string;
    disabilityFileName: string;
    link1: string;
    link2: string;
    link3: string;

    phone: string;

    isVeteranTarget: boolean;
    isDisabilityTarget: boolean;
};

const RecruitApply = () => {
    const { idx } = useParams<{ locale: string; idx: string }>();
    const router = useRouter();
    const jobId = useMemo(() => Number(idx) || -1, [idx]);

    const [ui, setUi] = useState<UIState>({
        email: "",
        authCode: "",
        emailSent: false,
        emailVerified: false,
        sendLoading: false,
        checkLoading: false,
        resendSec: 0,

        eduLevel: ApplyEducationLevel.BACHELOR,
        degreeDetail: "BACHELOR",
        gender: "MALE",

        photoPreview: "",
        portfolioName: "",
        coverLetterName: "",
        disabilityFileName: "",
        link1: "",
        link2: "",
        link3: "",

        phone: "",

        isVeteranTarget: false,
        isDisabilityTarget: false,
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

    const uploadIfPresent = async (fileLike: FormDataEntryValue | null): Promise<string> => {
        const f = fileLike as File | null;
        if (!f || !f.size) return "";
        const url = await upload(f);
        return url ?? "";
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setPartial({ phone: handlePhoneMask010(e.target.value) });

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            if (ui.photoPreview) URL.revokeObjectURL(ui.photoPreview);
            setPartial({ photoPreview: "" });
            return;
        }
        if (file.type !== "image/png") {
            alert("PNG 파일만 가능합니다.");
            e.currentTarget.value = "";
            if (ui.photoPreview) URL.revokeObjectURL(ui.photoPreview);
            setPartial({ photoPreview: "" });
            return;
        }
        const url = URL.createObjectURL(file);
        if (ui.photoPreview) URL.revokeObjectURL(ui.photoPreview);
        setPartial({ photoPreview: url });
    };

    const handleDocName = (key: keyof UIState) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setPartial({ [key]: file?.name ?? "" } as Partial<UIState>);
    };

    const handleLink =
        (key: "link1" | "link2" | "link3") => (e: React.ChangeEvent<HTMLInputElement>) => {
            setPartial({ [key]: e.target.value });
        };

    const emailApi = {
        send: async (email: string) => sendEmailApi(email),
        check: async (email: string, code: string) => checkEmailApi(email, code),
    };

    useEffect(() => {
        setUi((s) => ({ ...s, resendSec: 0, emailSent: false, emailVerified: false, authCode: "" }));
    }, [ui.email]);

    useEffect(() => {
        if (ui.resendSec <= 0) return;
        const id = setInterval(() => {
            setUi((s) => ({ ...s, resendSec: Math.max(0, s.resendSec - 1) }));
        }, 1000);
        return () => clearInterval(id);
    }, [ui.resendSec]);

    useEffect(() => {
        return () => {
            if (ui.photoPreview) URL.revokeObjectURL(ui.photoPreview);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const canSubmit = !isSubmitting && !isUploading && ui.emailVerified;

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!ui.emailVerified) {
            alert("이메일 인증 완료 후 제출 가능합니다.");
            return;
        }

        const fd = new FormData(e.currentTarget);

        // 이름(한글 2~5자)
        const nameValue = safeGet(fd, "name");
        if (!NAME_KO_REGEX.test(nameValue)) {
            alert("이름은 한글 2~5자로 입력해주세요.");
            return;
        }

        // 전화번호
        const phoneValue = safeGet(fd, "phone") || ui.phone;
        if (!/^010-\d{4}-\d{4}$/.test(phoneValue)) {
            alert("전화번호 형식이 올바르지 않습니다. 010-1234-5678 형식으로 입력해주세요.");
            return;
        }

        // 공고 유효성
        if (!Number.isFinite(jobId) || jobId <= 0) {
            alert("유효하지 않은 공고입니다.");
            return;
        }

        // 학력(대졸 이상) — UI detail 기준 검사
        if (!isEduAllowed(ui.degreeDetail, MIN_EDU_LEVEL)) {
            alert("해당 공고는 대졸 이상 지원 가능합니다. 학력을 다시 선택해주세요.");
            return;
        }

        // 성별 & 병역
        const militaryRaw = safeGet(fd, "military");
        if (!militaryRaw) {
            alert("병역 사항을 선택해주세요 (여성의 경우 '해당사항 없음').");
            return;
        }
        const selected = mapMil(militaryRaw);
        const military = normalizeMilitaryByGender(ui.gender, selected);

        // 입학/졸업 연월 검증
        const start = safeGet(fd, "eduStart");
        const end = safeGet(fd, "eduEnd");
        if (!start || !end) {
            alert("입학/졸업 연월을 모두 입력해주세요.");
            return;
        }
        const ps = parseYM(start);
        const pe = parseYM(end);
        if (!Number.isFinite(ps) || !Number.isFinite(pe)) {
            alert("입학/졸업 연월 형식이 올바르지 않습니다.");
            return;
        }
        if (ps > pe) {
            alert("입학일이 졸업일보다 늦을 수 없습니다. 날짜를 다시 확인해주세요.");
            return;
        }

        try {
            const photoUrl = await uploadIfPresent(fd.get("photo"));
            const portfolioUrl = await uploadIfPresent(fd.get("portfolio"));
            const coverLetterUrl = await uploadIfPresent(fd.get("coverletter"));
            const disabilityFileUrl = await uploadIfPresent(fd.get("disabilityFile"));

            const rawLinks = [
                safeGet(fd, "attachmentLink1"),
                safeGet(fd, "attachmentLink2"),
                safeGet(fd, "attachmentLink3"),
            ].filter(Boolean);

            const ordered: string[] = [];
            if (disabilityFileUrl) ordered.push(disabilityFileUrl);
            for (const link of rawLinks) ordered.push(link);
            const [attachment1 = "", attachment2 = "", attachment3 = ""] = ordered;

            // === 폼 객체 구성 (Client 전용) ===
            const form: RecruitFormData = {
                jobId,
                name: nameValue,
                phoneNumber: phoneValue,
                email: safeGet(fd, "email"),
                address: safeGet(fd, "address1"),
                addressDetail: safeGet(fd, "address2"),
                portfolio: portfolioUrl,
                coverLetter: coverLetterUrl,
                profileImage: photoUrl,
                educationLevel: ApplyEducationLevel.BACHELOR, // 서버 계약 준수
                degreeDetail: ui.degreeDetail,                 // UI 표기
                schoolName: safeGet(fd, "eduSchool"),
                admissionYear: start,
                graduationYear: end,
                department: safeGet(fd, "eduMajor"),
                gender: ui.gender,                             // 서버 미전송(로직용)
                military,
                attachment1,
                attachment2,
                attachment3,
            };

            // === 서버 페이로드 변환 ===
            const payload: RecruitRequest = toRecruitRequestPayload(form);

            submit(payload);
        } catch {
            alert("파일 업로드 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <Template>
            <div className="apply">
                <h1 className="apply__title">지원서 작성</h1>

                <form className="apply__form" noValidate onSubmit={onSubmit}>
                    <div className="apply__grid">
                        <div className="apply__left">
                            {/* 이름 */}
                            <div className="field">
                                <label>이름*</label>
                                <input
                                    name="name"
                                    placeholder="홍길동"
                                    required
                                    pattern="^[가-힣]{2,5}$"
                                    title="이름은 한글 2~5자로 입력해주세요."
                                />
                            </div>

                            {/* 성별 (서버 미전송, 병역 보정용) */}
                            <div className="field">
                                <label>성별*</label>
                                <div className="row gap8">
                                    <select
                                        name="gender"
                                        value={ui.gender}
                                        onChange={(e) => setPartial({ gender: e.target.value as Gender })}
                                        required
                                    >
                                        <option value="MALE">남성</option>
                                        <option value="FEMALE">여성</option>
                                        <option value="OTHER">기타/응답하지 않음</option>
                                    </select>
                                </div>
                            </div>

                            {/* 전화번호 */}
                            <div className="field">
                                <label>전화번호*</label>
                                <input
                                    name="phone"
                                    placeholder="010-1234-5678"
                                    required
                                    value={ui.phone}
                                    onChange={handlePhoneChange}
                                    inputMode="numeric"
                                    pattern="^010-\\d{4}-\\d{4}$"
                                    maxLength={13}
                                />
                                <label className="checkbox">
                                    <input type="checkbox" name="isForeignResident" /> 현재 외국 거주 중
                                </label>
                            </div>

                            {/* 이메일 인증 */}
                            <EmailVerifier
                                email={ui.email}
                                authCode={ui.authCode}
                                emailSent={ui.emailSent}
                                emailVerified={ui.emailVerified}
                                sendLoading={ui.sendLoading}
                                checkLoading={ui.checkLoading}
                                resendSec={ui.resendSec}
                                onChange={(patch) => setPartial(patch)}
                                api={emailApi}
                            />

                            {/* 거주지 */}
                            <div className="field">
                                <label>거주지*</label>
                                <input name="address1" placeholder="서울특별시 중구 세종대로 110" />
                                <input name="address2" placeholder="상세주소" />
                            </div>

                            {/* 파일 업로드 */}
                            <FilePicker
                                id="portfolio"
                                name="portfolio"
                                label="포트폴리오 / 이력서*"
                                sub="PDF 파일만 업로드 가능합니다."
                                accept="application/pdf"
                                required
                                fileName={ui.portfolioName}
                                onChange={handleDocName("portfolioName")}
                            />
                            <FilePicker
                                id="coverletter"
                                name="coverletter"
                                label="자기소개서"
                                sub="PDF 파일만 업로드 가능합니다."
                                accept="application/pdf"
                                fileName={ui.coverLetterName}
                                onChange={handleDocName("coverLetterName")}
                            />

                            {/* 학력 (UI: 석/박 표기 + 서버: BACHELOR 전송) */}
                            <EducationFields
                                value={ui.eduLevel}
                                degreeDetail={ui.degreeDetail}
                                onDegreeChange={(v) => setPartial({ degreeDetail: v })}
                            />

                            {/* 병역(필수) */}
                            <MilitarySelect required />

                            {/* 장애 대상 추가 입력 (옵션) */}
                            {ui.isDisabilityTarget && (
                                <div className="field">
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
                                        <FilePicker
                                            id="disabilityFile"
                                            name="disabilityFile"
                                            label="장애 증빙 자료"
                                            accept="application/pdf,image/*"
                                            fileName={ui.disabilityFileName}
                                            onChange={handleDocName("disabilityFileName")}
                                            compact
                                        />
                                    </div>
                                </div>
                            )}

                            {/* 링크 */}
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

                            {/* 안내 */}
                            <div className="notice">
                                <p>다음의 경우에 해당될 시, 채용 절차가 중단되거나 입사가 철회될 수 있습니다:</p>
                                <ul>
                                    <li>지원서 관련하여 허위 작성이나 부정확한 요청을 한 경우</li>
                                    <li>국내·해외 또는 해외 여행에 결격 사유가 있는 경우</li>
                                    <li>규정상 직무 수행이 불가능하거나, 사실 확인 과정에서 중대한 문제가 발견된 경우</li>
                                </ul>
                            </div>

                            <button className="apply__submit" type="submit" disabled={!canSubmit}>
                                {isSubmitting || isUploading ? "제출 중..." : ui.emailVerified ? "제출하기" : "이메일 인증 필요"}
                            </button>
                            <p className="apply__footer">기타 채용 관련 문의사항은 recruit@bigtablet.com 으로 연락 바랍니다</p>
                        </div>

                        {/* 사진 업로더 */}
                        <div className="apply__right">
                            <PhotoUploader
                                previewUrl={ui.photoPreview}
                                onChange={handlePhotoChange}
                                onClear={() => {
                                    if (ui.photoPreview) URL.revokeObjectURL(ui.photoPreview);
                                    setPartial({ photoPreview: "" });
                                    const input = document.querySelector<HTMLInputElement>('input[name="photo"]');
                                    if (input) input.value = "";
                                }}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </Template>
    );
};

export default RecruitApply;