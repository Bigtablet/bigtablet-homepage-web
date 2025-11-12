"use client";

import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { ApplyEducationLevel } from "src/entities/recruit/model/schema/recruit.schema";
import { ApplyFormProps } from "src/widgets/recruit/apply/form/type";
import { formatPhone010 } from "src/features/recruit/model/apply/util/apply.util";
import { FileInput } from "src/shared/ui/form/file";
import { TextField } from "src/shared/ui/form/textfield";
import { Select } from "src/shared/ui/general/select";
import { Button } from "src/shared/ui/general/button";
import { useGcpUpload } from "src/shared/stroage/gcp/hook/gcp.hook";
import "./style.scss";

const ApplyForm = ({ form, email, onSubmit }: ApplyFormProps) => {
    const { register, control, watch, setValue, formState } = form;
    const { upload, isPending: isUploading } = useGcpUpload();

    const educationLevel = watch("educationLevel");
    const isGed = educationLevel === ApplyEducationLevel.enum.GED;

    // GED 선택 시 불필요 필드 초기화
    useEffect(() => {
        if (isGed) {
            setValue("schoolName", "", { shouldDirty: true });
            setValue("graduationEnd", "", { shouldDirty: true });
            setValue("department", "", { shouldDirty: true });
        }
    }, [isGed, setValue]);

    return (
        <form className="apply__form" noValidate onSubmit={onSubmit}>
            <div className="apply__grid">
                <div className="apply__left">
                    <div className="field">
                        <label>이름*</label>
                        <TextField placeholder="홍길동" {...register("name", { required: true })} />
                    </div>

                    <div className="field">
                        <label>전화번호*</label>
                        <Controller
                            control={control}
                            name="phoneNumber"
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    placeholder="010-1234-5678"
                                    inputMode="numeric"
                                    maxLength={13}
                                    onChangeAction={(e) => field.onChange(formatPhone010(e.target.value))}
                                    value={field.value ?? ""}
                                />
                            )}
                        />
                    </div>

                    <div className="field">
                        <label>이메일*</label>
                        <div className="row gap8">
                            <TextField type="email" placeholder="example@email.com" {...register("email", { required: true })} />
                            <TextField
                                placeholder="인증코드"
                                value={email.authCode}
                                onChangeAction={(e) => email.setAuthCode(e.target.value)}
                            />
                            <Button
                                variant="secondary"
                                onClick={email.send}
                                disabled={email.sendLoading || email.resendSec > 0}
                                size="sm"
                                type="button"
                            >
                                {email.sendLoading ? "전송 중..." : email.resendSec > 0 ? `재전송 ${email.resendSec}s` : "전송"}
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={email.verify}
                                disabled={email.checkLoading}
                                size="sm"
                                type="button"
                            >
                                {email.checkLoading ? "확인 중..." : "확인"}
                            </Button>
                        </div>
                        <small className="help" aria-live="polite">
                            {email.emailVerified
                                ? "이메일 인증이 완료되었습니다."
                                : email.emailSent
                                    ? email.resendSec > 0
                                        ? `이메일로 전송된 인증 코드를 입력 후 확인을 눌러주세요. (재전송 ${email.resendSec}s)`
                                        : "이메일로 전송된 인증 코드를 입력 후 확인을 눌러주세요."
                                    : "이메일 인증 부탁드립니다"}
                        </small>
                    </div>

                    <div className="field">
                        <label>거주지*</label>
                        <TextField placeholder="서울특별시 중구 세종대로 110" {...register("address")} />
                        <TextField placeholder="상세주소" {...register("addressDetail")} />
                    </div>

                    <div className="field">
                        <label>
                            포트폴리오 / 이력서* <span className="sub">PDF만 가능</span>
                        </label>
                        <Controller
                            control={control}
                            name="portfolio"
                            rules={{ required: true }}
                            render={({ field }) => (
                                <FileInput
                                    layout="row"
                                    accept="application/pdf"
                                    disabled={isUploading}
                                    onFiles={async (file) => {
                                        if (!file) {
                                            field.onChange("");
                                            return;
                                        }
                                        const url = await upload(file);
                                        field.onChange(url);
                                    }}
                                />
                            )}
                        />
                    </div>

                    <div className="field">
                        <label>
                            자기소개서 <span className="sub">PDF만 가능</span>
                        </label>
                        <Controller
                            control={control}
                            name="coverLetter"
                            render={({ field }) => (
                                <FileInput
                                    layout="row"
                                    accept="application/pdf"
                                    disabled={isUploading}
                                    onFiles={async (file) => {
                                        if (!file) {
                                            field.onChange("");
                                            return;
                                        }
                                        const url = await upload(file);
                                        field.onChange(url);
                                    }}
                                />
                            )}
                        />
                    </div>

                    <div className="field">
                        <label>최종 학력*</label>

                        <div className={`row row--edu gap8 ${isGed ? "is-ged" : ""}`}>
                            <Controller
                                control={control}
                                name="educationLevel"
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Select
                                        placeholder="최종 학력 선택"
                                        value={field.value}
                                        onChange={(v) => field.onChange(v)}
                                        options={[
                                            { value: ApplyEducationLevel.enum.GED, label: "검정고시" },
                                            { value: ApplyEducationLevel.enum.HIGH_SCHOOL, label: "고등학교 졸업" },
                                            { value: ApplyEducationLevel.enum.ASSOCIATE, label: "전문대학 졸업" },
                                            { value: ApplyEducationLevel.enum.BACHELOR, label: "대학교 (4년제) 졸업" },
                                        ]}
                                        fullWidth
                                    />
                                )}
                            />
                            {!isGed && <TextField placeholder="학교명" {...register("schoolName", { required: !isGed })} />}
                        </div>

                        {isGed ? (
                            <div className="row row--ged gap8">
                                <TextField
                                    type="month"
                                    placeholder="합격연도(YYYY-MM)"
                                    {...register("admissionYear", { required: true })}
                                />
                            </div>
                        ) : (
                            <>
                                <div className="row row--edu-dates gap8">
                                    <TextField
                                        type="month"
                                        placeholder="입학년도(YYYY-MM)"
                                        {...register("admissionYear", { required: true })}
                                    />
                                    <TextField
                                        type="month"
                                        placeholder="졸업년도(YYYY-MM)"
                                        {...register("graduationEnd", { required: true })}
                                    />
                                </div>
                                <TextField placeholder="계열 (학과)" {...register("department", { required: true })} />
                            </>
                        )}
                    </div>

                    <div className="field">
                        <label>병역 사항*</label>
                        <Controller
                            control={control}
                            name="military"
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Select
                                    placeholder="병역 사항 선택"
                                    value={field.value}
                                    onChange={(v) => field.onChange(v)}
                                    options={[
                                        { value: "", label: "병역 사항 선택", disabled: true },
                                        { value: "COMPLETED", label: "군필" },
                                        { value: "NOT_APPLICABLE", label: "면제" },
                                        { value: "NOT_COMPLETED", label: "미필" },
                                        { value: "COMPLETED", label: "해당 없음" },
                                    ]}
                                    fullWidth
                                />
                            )}
                        />
                    </div>

                    <div className="field">
                        <label>
                            첨부 자료 <span className="sub">링크 3개까지 (GitHub, Notion 등)</span>
                        </label>
                        <div className="stack">
                            <TextField type="url" placeholder="https://github.com/..." {...register("attachment1")} />
                            <TextField type="url" placeholder="https://www.notion.so/..." {...register("attachment2")} />
                            <TextField type="url" placeholder="https://portfolio.site/..." {...register("attachment3")} />
                        </div>
                        <small className="help">http(s)로 시작하는 전체 URL을 입력해 주세요.</small>
                    </div>

                    <Button
                        className="apply__submit"
                        type="submit"
                        size="lg"
                        disabled={formState.isSubmitting || isUploading}
                    >
                        제출하기
                    </Button>
                    <p className="apply__footer">기타 채용 관련 문의사항은 recruit@bigtablet.com 으로 연락 바랍니다</p>
                </div>

                <div className="apply__right">
                    <label>프로필 사진*</label>
                    <Controller
                        control={control}
                        name="profileImage"
                        rules={{ required: true }}
                        render={({ field }) => (
                            <FileInput
                                layout="column"
                                accept="image/png"
                                disabled={isUploading}
                                onFiles={async (file) => {
                                    if (!file) {
                                        field.onChange("");
                                        return;
                                    }
                                    const url = await upload(file);
                                    field.onChange(url);
                                }}
                            />
                        )}
                    />
                    <p>PNG 파일만 업로드 가능합니다.</p>
                </div>
            </div>
        </form>
    );
};

export default ApplyForm;