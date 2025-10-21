"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AdminLayout from "src/components/common/admin/layout";
import { Toast } from "src/libs/toast/toast";

import {
    useRecruitDetailQuery,
    useRecruitUpdateMutation,
} from "src/queries/recruit/recruit.query";

import {
    DepartmentType,
    LocationType,
    RecruitType,
    EducationType,
    RecruitResponse,
} from "src/types/recruit/recruit.type";

import {
    departmentLabel,
    educationLabel,
    locationLabel,
    recruitTypeLabel,
    DEPARTMENTS,
    EDUCATIONS,
    LOCATIONS,
    RECRUIT_TYPES,
} from "src/utils/job/label";

import "./style.scss";

type FormState = {
    title: string;
    department: DepartmentType | "";
    location: LocationType | "";
    recruitType: RecruitType | "";
    experiment: string;
    education: EducationType | "";
    companyIntroduction: string;
    mainResponsibility: string;
    qualification: string;
    preferredQualification: string;
    startDate: string;
    endDate: string;
};

const EditJobPage = () => {
    const router = useRouter();
    const params = useSearchParams();
    const idx = useMemo(() => Number(params.get("idx") ?? 0), [params]);

    const { data: detail, isLoading } = useRecruitDetailQuery(idx, { enabled: !!idx });

    const [form, setForm] = useState<FormState>({
        title: "",
        department: "",
        location: "",
        recruitType: "",
        experiment: "",
        education: "",
        companyIntroduction: "",
        mainResponsibility: "",
        qualification: "",
        preferredQualification: "",
        startDate: "",
        endDate: "",
    });

    useEffect(() => {
        if (!detail) return;
        const d = detail as RecruitResponse;
        setForm({
            title: d.title ?? "",
            department: d.department ?? "",
            location: d.location ?? "",
            recruitType: d.recruitType ?? "",
            experiment: d.experiment ?? "",
            education: d.education ?? "",
            companyIntroduction: d.companyIntroduction ?? "",
            mainResponsibility: d.mainResponsibility ?? "",
            qualification: d.qualification ?? "",
            preferredQualification: d.preferredQualification ?? "",
            startDate: (d.startDate ?? "").slice(0, 10),
            endDate: (d.endDate ?? "").slice(0, 10),
        });
    }, [detail]);

    const onChange = <K extends keyof FormState>(k: K, v: FormState[K]) =>
        setForm((s) => ({ ...s, [k]: v }));

    const update = useRecruitUpdateMutation({
        onSuccess: () => {
            Toast("success", "채용공고가 수정되었습니다.");
            router.push("/admin/jobs");
        },
        onError: () => Toast("error", "수정에 실패했습니다."),
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!idx) return Toast("error", "잘못된 접근입니다. (idx 없음)");

        const payload = {
            idx,
            title: form.title,
            department: form.department as DepartmentType,
            location: form.location as LocationType,
            recruitType: form.recruitType as RecruitType,
            experiment: form.experiment,
            education: form.education as EducationType,
            companyIntroduction: form.companyIntroduction,
            mainResponsibility: form.mainResponsibility,
            qualification: form.qualification,
            preferredQualification: form.preferredQualification,
            startDate: form.startDate || "",
            endDate: form.endDate || "",
        } as RecruitResponse & { idx: number };

        update.mutate(payload);
    };

    if (!idx) {
        return (
            <AdminLayout>
                <main className="jobs-page">
                    <div className="jobs-page__table">
                        <div className="empty">잘못된 접근입니다. (idx 누락)</div>
                    </div>
                </main>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <main className="jobs-page">
                <header className="jobs-page__header">
                    <h1 className="jobs-page__title">채용공고 수정</h1>
                    <div className="jobs-page__header-actions">
                        <Link href="/admin/jobs" className="btn">목록</Link>
                        <button
                            className="btn btn--primary"
                            onClick={onSubmit}
                            disabled={update.isPending}
                        >
                            {update.isPending ? "저장 중…" : "저장"}
                        </button>
                    </div>
                </header>

                <section className="jobs-page__table jobs-edit">
                    {isLoading ? (
                        <div className="empty">불러오는 중...</div>
                    ) : (
                        <form onSubmit={onSubmit}>
                            <div className="form-grid">
                                <label className="form-item">
                                    <span className="form-label">제목</span>
                                    <input
                                        className="input"
                                        value={form.title}
                                        onChange={(e) => onChange("title", e.target.value)}
                                        required
                                    />
                                </label>

                                <label className="form-item">
                                    <span className="form-label">부서</span>
                                    <select
                                        className="select"
                                        value={form.department}
                                        onChange={(e) => onChange("department", e.target.value as DepartmentType)}
                                        required
                                    >
                                        <option value="">선택</option>
                                        {DEPARTMENTS.map((code) => (
                                            <option key={code} value={code}>
                                                {departmentLabel(code)}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label className="form-item">
                                    <span className="form-label">근무지</span>
                                    <select
                                        className="select"
                                        value={form.location}
                                        onChange={(e) => onChange("location", e.target.value as LocationType)}
                                        required
                                    >
                                        <option value="">선택</option>
                                        {LOCATIONS.map((code) => (
                                            <option key={code} value={code}>
                                                {locationLabel(code)}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label className="form-item">
                                    <span className="form-label">형태</span>
                                    <select
                                        className="select"
                                        value={form.recruitType}
                                        onChange={(e) => onChange("recruitType", e.target.value as RecruitType)}
                                        required
                                    >
                                        <option value="">선택</option>
                                        {RECRUIT_TYPES.map((code) => (
                                            <option key={code} value={code}>
                                                {recruitTypeLabel(code)}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label className="form-item">
                                    <span className="form-label">학력</span>
                                    <select
                                        className="select"
                                        value={form.education}
                                        onChange={(e) => onChange("education", e.target.value as EducationType)}
                                    >
                                        <option value="">선택</option>
                                        {EDUCATIONS.map((code) => (
                                            <option key={code} value={code}>
                                                {educationLabel(code)}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label className="form-item">
                                    <span className="form-label">경력</span>
                                    <input
                                        className="input"
                                        value={form.experiment}
                                        onChange={(e) => onChange("experiment", e.target.value)}
                                    />
                                </label>

                                <label className="form-item form-item--full">
                                    <span className="form-label">회사 소개</span>
                                    <textarea
                                        className="textarea"
                                        rows={5}
                                        value={form.companyIntroduction}
                                        onChange={(e) => onChange("companyIntroduction", e.target.value)}
                                    />
                                </label>

                                <label className="form-item form-item--full">
                                    <span className="form-label">주요 업무</span>
                                    <textarea
                                        className="textarea"
                                        rows={5}
                                        value={form.mainResponsibility}
                                        onChange={(e) => onChange("mainResponsibility", e.target.value)}
                                    />
                                </label>

                                <label className="form-item form-item--full">
                                    <span className="form-label">자격 요건</span>
                                    <textarea
                                        className="textarea"
                                        rows={5}
                                        value={form.qualification}
                                        onChange={(e) => onChange("qualification", e.target.value)}
                                    />
                                </label>

                                <label className="form-item form-item--full">
                                    <span className="form-label">우대 사항</span>
                                    <textarea
                                        className="textarea"
                                        rows={5}
                                        value={form.preferredQualification}
                                        onChange={(e) => onChange("preferredQualification", e.target.value)}
                                    />
                                </label>

                                <label className="form-item">
                                    <span className="form-label">시작일</span>
                                    <input
                                        type="date"
                                        className="input"
                                        value={form.startDate}
                                        onChange={(e) => onChange("startDate", e.target.value)}
                                    />
                                </label>

                                <label className="form-item">
                                    <span className="form-label">마감일</span>
                                    <input
                                        type="date"
                                        className="input"
                                        value={form.endDate}
                                        onChange={(e) => onChange("endDate", e.target.value)}
                                    />
                                </label>
                            </div>

                            <div className="form-actions">
                                <Link href="/admin/jobs" className="btn">취소</Link>
                                <button type="submit" className="btn btn--primary" disabled={update.isPending}>
                                    {update.isPending ? "저장 중…" : "저장"}
                                </button>
                            </div>
                        </form>
                    )}
                </section>
            </main>
        </AdminLayout>
    );
};

export default EditJobPage;