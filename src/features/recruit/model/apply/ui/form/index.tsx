"use client";

import {Controller} from "react-hook-form";
import {ApplyEducationLevel} from "src/entities/recruit/model/schema/recruit.schema";
import {ApplyFormProps} from "src/features/recruit/model/apply/ui/form/type";
import {formatPhone010} from "src/features/recruit/model/apply/utils";
import UploadInput from "src/features/recruit/model/apply/ui/upload";

const ApplyForm = ({form, email, onSubmit}: ApplyFormProps) => {
    const {register, control, watch, formState: {isSubmitting}} = form;
    const educationLevel = watch("educationLevel");
    const isGed = educationLevel === ApplyEducationLevel.enum.GED;

    return (
        <form className="apply__form" noValidate onSubmit={onSubmit}>
            <div className="apply__grid">
                <div className="apply__left">
                    <div className="field">
                        <label>이름*</label>
                        <input {...register("name")} placeholder="홍길동" required/>
                    </div>

                    <div className="field">
                        <label>전화번호*</label>
                        <Controller
                            control={control}
                            name="phoneNumber"
                            render={({field}) => (
                                <input
                                    {...field}
                                    placeholder="010-1234-5678"
                                    inputMode="numeric"
                                    maxLength={13}
                                    onChange={(e) => field.onChange(formatPhone010(e.target.value))}
                                />
                            )}
                        />
                    </div>

                    <div className="field">
                        <label>이메일*</label>
                        <div className="row gap8">
                            <input {...register("email")} type="email" placeholder="example@email.com"/>
                            <input placeholder="인증코드" value={email.authCode} onChange={(e) => email.setAuthCode(e.target.value)}/>
                            <button type="button" className="btn ghost" onClick={email.send}
                                    disabled={email.sendLoading || email.resendSec > 0}>
                                {email.sendLoading ? "전송 중..." : email.resendSec > 0 ? `재전송 ${email.resendSec}s` : "전송"}
                            </button>
                            <button type="button" className="btn ghost" onClick={email.verify}
                                    disabled={email.checkLoading}>
                                {email.checkLoading ? "확인 중..." : "확인"}
                            </button>
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
                        <label>거주지</label>
                        <input {...register("address")} placeholder="서울특별시 중구 세종대로 110"/>
                        <input {...register("addressDetail")} placeholder="상세주소"/>
                    </div>

                    <div className="field">
                        <label>포트폴리오 / 이력서* <span className="sub">PDF만 가능</span></label>
                        <UploadInput name="portfolio" accept="application/pdf" required/>
                    </div>

                    <div className="field">
                        <label>자기소개서 <span className="sub">PDF만 가능</span></label>
                        <UploadInput name="coverletter" accept="application/pdf"/>
                    </div>

                    <div className="field">
                        <label>최종 학력*</label>
                        <div className="row gap8">
                            <select {...register("educationLevel")} required>
                                <option value={ApplyEducationLevel.enum.GED}>검정고시</option>
                                <option value={ApplyEducationLevel.enum.HIGH_SCHOOL}>고등학교 졸업</option>
                                <option value={ApplyEducationLevel.enum.ASSOCIATE}>전문대학 졸업</option>
                                <option value={ApplyEducationLevel.enum.BACHELOR}>대학교 (4년제) 졸업</option>
                            </select>
                            {!isGed && <input {...register("schoolName")} placeholder="학교명"/>}
                        </div>

                        {!isGed && (
                            <>
                                <div className="row gap8">
                                    <input {...register("admissionYear")} type="month" placeholder="입학년도(YYYY-MM)"/>
                                    <input {...register("graduationEnd")} type="month" placeholder="졸업년도(YYYY-MM)"/>
                                </div>
                                <input {...register("department")} placeholder="계열 (학과)"/>
                            </>
                        )}
                    </div>

                    <div className="field">
                        <label>병역 사항</label>
                        <select {...register("military")} defaultValue="">
                            <option value="" disabled>병역 사항 선택</option>
                            <option value="DONE">군필</option>
                            <option value="EXEMPT">면제</option>
                            <option value="PENDING">미필</option>
                        </select>
                    </div>

                    <div className="field">
                        <label>첨부 자료 <span className="sub">링크 3개까지 (GitHub, Notion 등)</span></label>
                        <div className="stack">
                            <input {...register("attachment1")} type="url" placeholder="https://github.com/..."/>
                            <input {...register("attachment2")} type="url" placeholder="https://www.notion.so/..."/>
                            <input {...register("attachment3")} type="url"
                                   placeholder="https://portfolio.site/..."/>
                        </div>
                        <small className="help">http(s)로 시작하는 전체 URL을 입력해 주세요.</small>
                    </div>

                    <button className="apply__submit" type="submit" disabled={isSubmitting}>
                        제출하기
                    </button>
                    <p className="apply__footer">기타 채용 관련 문의사항은 recruit@bigtablet.com 으로 연락 바랍니다</p>
                </div>

                <div className="apply__right">
                    <label>프로필 사진*</label>
                    <UploadInput name="photo" accept="image/png" imagePreview/>
                    <p>PNG 파일만 업로드 가능합니다.</p>
                </div>
            </div>
        </form>
    );
}

export default ApplyForm;