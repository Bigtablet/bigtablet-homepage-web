"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import "./style.scss";
import AdminLayout from "src/components/common/admin/layout";
import { useRecruitListQuery, useRecruitDeleteMutation } from "src/queries/recruit/recruit.query";
import { Toast } from "src/libs/toast/toast";

const Jobs = () => {
    const [q, setQ] = useState("");

    const { data, isLoading } = useRecruitListQuery();

    const rows = useMemo(() => {
        const list = data ?? [];
        const keyword = q.trim().toLowerCase();
        if (!keyword) return list;
        return list.filter((c) =>
            [c.title, c.department, c.location, c.recruitType].some((v) =>
                String(v).toLowerCase().includes(keyword)
            )
        );
    }, [data, q]);

    const del = useRecruitDeleteMutation({
        onSuccess: () => Toast("success", "삭제되었습니다."),
        onError: () => Toast("error", "삭제에 실패했습니다."),
    });

    return (
        <AdminLayout>
            <main className="jobs-page">
                <header className="jobs-page__header">
                    <h1 className="jobs-page__title">채용공고 관리</h1>
                    <Link href="/admin/jobs/new" className="btn btn--primary">+ 새 공고 등록</Link>
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
                    {isLoading ? (
                        <div className="empty">불러오는 중...</div>
                    ) : !rows.length ? (
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
                            {rows.map((job, i) => (
                                <tr key={job.idx ?? `${job.title}-${i}`}>
                                    <td>
                                        <Link href={`/admin/jobs/${job.idx ?? ""}`} className="link">
                                            {job.title}
                                        </Link>
                                    </td>
                                    <td>{job.department}</td>
                                    <td>{job.location === "SEOUL" ? "서울" : "대구"}</td>
                                    <td>
                                        {job.recruitType === "FULL_TIME"
                                            ? "정규직"
                                            : job.recruitType === "CONTRACT"
                                                ? "계약직"
                                                : "인턴"}
                                    </td>
                                    <td>{job.startDate} ~ {job.endDate}</td>
                                    <td>
                      <span className={`status ${job.dday === "마감" ? "status--마감" : "status--진행중"}`}>
                        {job.dday === "마감" ? "마감" : "진행중"}{" "}
                          {job.dday !== "상시" && job.dday !== "마감" && <em className="dday">{job.dday}</em>}
                      </span>
                                    </td>
                                    <td className="tags">
                                        {(job.tags ?? []).map((t, idx) => <span key={idx} className="tag">{t}</span>)}
                                    </td>
                                    <td className="actions">
                                        <Link href={`/admin/jobs/${job.idx ?? ""}/edit`} className="btn">수정</Link>
                                        <button
                                            className="btn btn--danger"
                                            onClick={() => {
                                                if (!job.idx) return;
                                                if (confirm("정말 삭제하시겠습니까?")) {
                                                    del.mutate(job.idx);
                                                }
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
            </main>
        </AdminLayout>
    );
};

export default Jobs;