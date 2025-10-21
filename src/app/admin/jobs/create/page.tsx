"use client";

import "./style.scss";
import usePostJob from "src/hooks/job/useJob";
import AdminLayout from "src/components/common/admin/layout";

const CreateJob = () => {
    const { value, onChange, canSubmit, submit, isSubmitting, enums } = usePostJob();

    return (
        <AdminLayout>
            <h1 className="job-form__title">채용공고 등록</h1>

            <form
                className="job-form__grid"
                onSubmit={(e) => { e.preventDefault(); submit(); }}
            >
                {/* 기본정보 */}
                <div className="job-form__card">
                    <div className="job-form__section-title">기본 정보</div>

                    <label className="field">
                        <span className="field__label">제목*</span>
                        <input
                            className="field__control"
                            name="title"
                            value={value.title}
                            onChange={onChange}
                            placeholder="예) 백엔드 개발자"
                        />
                    </label>

                    <div className="field-row">
                        <label className="field">
                            <span className="field__label">직무*</span>
                            <select
                                className="field__control"
                                name="department"
                                value={value.department}
                                onChange={onChange}
                            >
                                {enums.DEPARTMENTS.map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </label>

                        <label className="field">
                            <span className="field__label">근무 위치*</span>
                            <select
                                className="field__control"
                                name="location"
                                value={value.location}
                                onChange={onChange}
                            >
                                {enums.LOCATIONS.map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </label>

                        <label className="field">
                            <span className="field__label">채용 방식*</span>
                            <select
                                className="field__control"
                                name="recruitType"
                                value={value.recruitType}
                                onChange={onChange}
                            >
                                {enums.RECRUIT_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </label>
                    </div>

                    <div className="field-row">
                        <label className="field">
                            <span className="field__label">경력*</span>
                            <input
                                className="field__control"
                                name="experiment"
                                value={value.experiment}
                                onChange={onChange}
                                placeholder="예) 3년 이상"
                            />
                        </label>

                        <label className="field">
                            <span className="field__label">학력*</span>
                            <select
                                className="field__control"
                                name="education"
                                value={value.education}
                                onChange={onChange}
                            >
                                {enums.EDUCATIONS.map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </label>
                    </div>

                    <div className="field-row">
                        <label className="field">
                            <span className="field__label">시작일*</span>
                            <input
                                className="field__control"
                                type="date"
                                name="startDate"
                                value={value.startDate}
                                onChange={onChange}
                            />
                        </label>

                        <label className="field">
                            <span className="field__label">마감일*</span>
                            <input
                                className="field__control"
                                type="date"
                                name="endDate"
                                value={value.endDate}
                                onChange={onChange}
                            />
                        </label>
                    </div>
                </div>

                {/* 상세내용 */}
                <div className="job-form__card">
                    <div className="job-form__section-title">상세 내용</div>

                    <label className="field">
                        <span className="field__label">조직 소개*</span>
                        <textarea
                            className="field__control field__textarea"
                            name="companyIntroduction"
                            value={value.companyIntroduction}
                            onChange={onChange}
                        />
                    </label>

                    <label className="field">
                        <span className="field__label">주요 업무*</span>
                        <textarea
                            className="field__control field__textarea"
                            name="mainResponsibility"
                            value={value.mainResponsibility}
                            onChange={onChange}
                        />
                    </label>

                    <label className="field">
                        <span className="field__label">자격 요건*</span>
                        <textarea
                            className="field__control field__textarea"
                            name="qualification"
                            value={value.qualification}
                            onChange={onChange}
                        />
                    </label>

                    <label className="field">
                        <span className="field__label">우대 사항</span>
                        <textarea
                            className="field__control field__textarea"
                            name="preferredQualification"
                            value={value.preferredQualification || ""}
                            onChange={onChange}
                        />
                    </label>
                </div>

                <div className="job-form__actions">
                    <button
                        type="submit"
                        className="btn btn--primary"
                        disabled={!canSubmit || isSubmitting}
                    >
                        {isSubmitting ? "등록 중..." : "등록하기"}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
};

export default CreateJob;