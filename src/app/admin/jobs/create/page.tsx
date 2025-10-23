"use client";

import "./style.scss";
import AdminLayout from "src/components/common/admin/layout";
import usePostJob from "src/hooks/job/useJob";

const CreateJob = () => {
    const { value, onChange, canSubmit, submit, isSubmitting, enums, isEvergreen, onToggleEvergreen } = usePostJob();

    return (
        <AdminLayout>
            <h1 className="job-form__title">채용공고 등록</h1>
            <form
                className="job-form__grid"
                onSubmit={(e) => { e.preventDefault(); submit(); }}
                noValidate
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
                            required
                            autoComplete="off"
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
                                required
                            >
                                {enums.DEPARTMENTS.map(({ value, label }) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </label>

                        <label className="field">
                            <span className="field__label">근무 위치*</span>
                            <select
                                className="field__control"
                                name="location"
                                value={value.location}
                                onChange={onChange}
                                required
                            >
                                {enums.LOCATIONS.map(({ value, label }) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </label>

                        <label className="field">
                            <span className="field__label">채용 방식*</span>
                            <select
                                className="field__control"
                                name="recruitType"
                                value={value.recruitType}
                                onChange={onChange}
                                required
                            >
                                {enums.RECRUIT_TYPES.map(({ value, label }) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
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
                                required
                                autoComplete="off"
                            />
                        </label>

                        <label className="field">
                            <span className="field__label">학력*</span>
                            <select
                                className="field__control"
                                name="education"
                                value={value.education}
                                onChange={onChange}
                                required
                            >
                                {enums.EDUCATIONS.map(({ value, label }) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </label>
                    </div>

                    {/* 날짜 */}
                    <div className="field-row">
                        <label className="field">
                            <span className="field__label">시작일*</span>
                            <input
                                className="field__control"
                                type="date"
                                name="startDate"
                                value={value.startDate}
                                onChange={onChange}
                                required
                            />
                        </label>

                        {!isEvergreen && (
                            <label className="field">
                                <span className="field__label">마감일*</span>
                                <input
                                    className="field__control"
                                    type="date"
                                    name="endDate"
                                    value={value.endDate}
                                    onChange={onChange}
                                    required
                                />
                            </label>
                        )}
                    </div>

                    {/* 상시 체크박스 */}
                    <div className="field-row field-row--inline">
                        <label className="checkbox">
                            <input
                                type="checkbox"
                                checked={isEvergreen}
                                onChange={(e) => onToggleEvergreen(e.target.checked)}
                            />
                            <span>상시 채용</span>
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
                            required
                        />
                    </label>

                    <label className="field">
                        <span className="field__label">주요 업무*</span>
                        <textarea
                            className="field__control field__textarea"
                            name="mainResponsibility"
                            value={value.mainResponsibility}
                            onChange={onChange}
                            required
                        />
                    </label>

                    <label className="field">
                        <span className="field__label">자격 요건*</span>
                        <textarea
                            className="field__control field__textarea"
                            name="qualification"
                            value={value.qualification}
                            onChange={onChange}
                            required
                        />
                    </label>

                    <label className="field">
                        <span className="field__label">우대 사항*</span>
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
}

export default CreateJob;