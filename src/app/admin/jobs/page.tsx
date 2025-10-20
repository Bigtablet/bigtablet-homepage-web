"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./style.scss";
import AdminLayout from "src/components/common/admin/layout";
import {
    useRecruitListQuery,
    useRecruitDeleteMutation,
    useRecruitApplicantListQuery,
} from "src/queries/recruit/recruit.query";
import { Toast } from "src/libs/toast/toast";
import {
    statusLabel,
    educationLabel,
    departmentLabel,
    recruitTypeLabel,
    locationLabel,
} from "src/utils/job/label";

const Jobs = () => {
    const router = useRouter();

    // ───────────────────────── 채용공고 목록 영역
    const [q, setQ] = useState("");
    const { data: jobs, isLoading: jobsLoading } = useRecruitListQuery();

    const jobRows = useMemo(() => {
        const list = jobs ?? [];
        const keyword = q.trim().toLowerCase();
        if (!keyword) return list;
        return list.filter((c) =>
            [c.title, c.department, c.location, c.recruitType].some((v) =>
                String(v).toLowerCase().includes(keyword)
            )
        );
    }, [jobs, q]);

    const del = useRecruitDeleteMutation({
        onSuccess: () => Toast("success", "삭제되었습니다."),
        onError: () => Toast("error", "삭제에 실패했습니다."),
    });

    // ───────────────────────── 지원자 리스트 영역
    const [applicantSearch, setApplicantSearch] = useState("");
    const [filterJobId, setFilterJobId] = useState<number | "ALL">("ALL");
    const { data: applicants, isLoading: applicantsLoading } = useRecruitApplicantListQuery();

    const applicantsRows = useMemo(() => {
        const list = applicants ?? [];
        const byJob = filterJobId === "ALL" ? list : list.filter((a) => a.jobId === filterJobId);
        const keyword = applicantSearch.trim().toLowerCase();
        if (!keyword) return byJob;
        return byJob.filter((a) =>
            [a.name, a.email, a.department, a.status].some((v) =>
                String(v).toLowerCase().includes(keyword)
            )
        );
    }, [applicants, applicantSearch, filterJobId]);

    const jobOptions = useMemo(
        () =>
            (jobs ?? [])
                .filter((j) => j.idx != null)
                .map((j) => ({ id: j.idx as number, title: j.title })),
        [jobs]
    );

    return (
        <AdminLayout>
            <main className="jobs-page">
                {/* ───────────── 채용공고 섹션 */}
                <header className="jobs-page__header">
                    <h1 className="jobs-page__title">채용공고 관리</h1>
                    <Link href="/admin/jobs/new" className="btn btn--primary">
                        + 새 공고 등록
                    </Link>
                </header>

                <section className="jobs-page__filters">
                    <input
                        className="input"
                        placeholder="제목 / 부서 / 지역 검색"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                </section>

                <section className="jobs-page__table">
                    {jobsLoading ? (
                        <div className="empty">불러오는 중...</div>
                    ) : !jobRows.length ? (
                        <div className="empty">
                            등록된 공고가 없습니다. <Link href="/admin/jobs/new">첫 공고를 등록하세요.</Link>
                        </div>
                    ) : (
                        <table>
                            <thead>
                            <tr>
                                <th>제목</th>
                                <th>부서</th>
                                <th>근무지</th>
                                <th>형태</th>
                                <th>기간</th>
                                <th>상태</th>
                                <th>태그</th>
                                <th>관리</th>
                            </tr>
                            </thead>
                            <tbody>
                            {jobRows.map((job, i) => (
                                <tr key={job.idx ?? `${job.title}-${i}`}>
                                    <td>
                                        <Link href={`/admin/jobs/${job.idx ?? ""}`} className="link">
                                            {job.title}
                                        </Link>
                                    </td>
                                    <td>{departmentLabel(job.department)}</td>
                                    <td>{locationLabel(job.location)}</td>
                                    <td>{recruitTypeLabel(job.recruitType)}</td>
                                    <td>
                                        {job.startDate} ~ {job.endDate}
                                    </td>
                                    <td>
                      <span className={`status ${job.dday === "마감" ? "status--마감" : "status--진행중"}`}>
                        {job.dday === "마감" ? "마감" : "진행중"}{" "}
                          {job.dday !== "상시" && job.dday !== "마감" && <em className="dday">{job.dday}</em>}
                      </span>
                                    </td>
                                    <td className="tags">
                                        {(job.tags ?? []).map((t, idx) => (
                                            <span key={idx} className="tag">
                          {t}
                        </span>
                                        ))}
                                    </td>
                                    <td className="actions">
                                        <Link href={`/admin/jobs/${job.idx ?? ""}/edit`} className="btn">
                                            수정
                                        </Link>
                                        <button
                                            className="btn btn--danger"
                                            onClick={() => {
                                                if (!job.idx) return;
                                                if (confirm("정말 삭제하시겠습니까?")) del.mutate(job.idx);
                                            }}
                                            disabled={!job.idx || del.isPending}
                                        >
                                            {del.isPending ? "삭제 중…" : "삭제"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </section>

                {/* ───────────── 지원자 섹션 (채용공고 아래에 표시) */}
                <section className="jobs-page__applicants">
                    <div className="jobs-page__applicants-header">
                        <h2 className="jobs-page__subtitle">지원자 목록</h2>

                        <div className="jobs-page__applicants-filters">
                            <select
                                className="select"
                                value={filterJobId}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setFilterJobId(v === "ALL" ? "ALL" : Number(v));
                                }}
                            >
                                <option value="ALL">전체 공고</option>
                                {jobOptions.map((j) => (
                                    <option key={j.id} value={j.id}>
                                        {j.title}
                                    </option>
                                ))}
                            </select>

                            <input
                                className="input"
                                placeholder="이름 / 이메일 / 학과 / 상태 검색"
                                value={applicantSearch}
                                onChange={(e) => setApplicantSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="jobs-page__table">
                        {applicantsLoading ? (
                            <div className="empty">불러오는 중...</div>
                        ) : !applicantsRows.length ? (
                            <div className="empty">등록된 지원자가 없습니다.</div>
                        ) : (
                            <table>
                                <thead>
                                <tr>
                                    <th>프로필</th>
                                    <th>이름</th>
                                    <th>이메일</th>
                                    <th>전화번호</th>
                                    <th>학력</th>
                                    <th>학과</th>
                                    <th>상태</th>
                                    <th>등록일</th>
                                </tr>
                                </thead>
                                <tbody>
                                {applicantsRows.map((a) => (
                                    <tr
                                        key={a.idx}
                                        className="clickable-row"
                                        onClick={() => router.push(`/admin/jobs/${a.idx}`)}  // ✅ 올바른 경로로 수정
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                router.push(`/admin/jobs/${a.idx}`);
                                            }
                                        }}
                                    >
                                        <td>
                                            <img src={a.profileImage} alt={a.name} className="jobs-page__thumb" />
                                        </td>
                                        <td>
                                            <Link
                                                href={`/admin/applicants/${a.idx}`}
                                                className="link"
                                                onClick={(e) => e.stopPropagation()} // ✅ 행 클릭과 충돌 방지
                                            >
                                                {a.name}
                                            </Link>
                                        </td>
                                        <td>{a.email}</td>
                                        <td>{a.phoneNumber}</td>
                                        <td>{educationLabel(a.educationLevel)}</td>
                                        <td>{a.department}</td>
                                        <td>
                        <span className={`status status--${String(a.status).toLowerCase()}`}>
                          {statusLabel(a.status)}
                        </span>
                                        </td>
                                        <td>{a.createdAt?.split("T")[0]}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </section>
            </main>
        </AdminLayout>
    );
};

export default Jobs;