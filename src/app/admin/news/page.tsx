"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import AdminLayout from "src/components/common/admin/layout";
import { useNewsPageQuery, useNewsDeleteMutation } from "src/queries/news/news.query";
import { Toast } from "src/libs/toast/toast";
import "./style.scss";

const formatDate = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
};

const NewsPage = () => {
    const router = useRouter();
    const sp = useSearchParams();

    const page = useMemo(() => Number(sp.get("page") ?? "1"), [sp]);
    const size = 5;
    const { data, isLoading, isError } = useNewsPageQuery(page, size);

    // 삭제 뮤테이션
    const del = useNewsDeleteMutation();

    const go = (next: number) => {
        router.replace(`/admin/news?page=${next}`);
    };

    return (
        <AdminLayout>
            <div className="news-list-page">
                <div className="top">
                    <h1>뉴스 관리</h1>
                    <Link href="/admin/news/create" className="btn-primary">
                        새 뉴스 등록
                    </Link>
                </div>

                {isLoading && <div className="state">불러오는 중...</div>}
                {isError && <div className="state error">데이터를 불러오지 못했습니다.</div>}

                <ul className="list">
                    {(data ?? []).map((item) => (
                        <li key={item.idx}>
                            <div className="info">
                                {/* 상세로 이동 */}
                                <Link href={`/admin/news/${item.idx}`} className="title-kr link">
                                    {item.titleKr}
                                </Link>
                                <p className="title-en">{item.titleEn}</p>

                                {/* 원문 링크 */}
                                <a href={item.newsUrl} target="_blank" rel="noreferrer">
                                    {item.newsUrl}
                                </a>

                                <span className="date">작성일 {formatDate(item.createdAt)}</span>
                            </div>

                            {/* 우측 액션 */}
                            <div className="actions">
                                {/* 수정: /admin/news/edit로 이동 (idx 쿼리 전달) */}
                                <Link href={`/admin/news/edit?idx=${item.idx}`} className="btn btn-edit">
                                    수정
                                </Link>

                                {/* 삭제 */}
                                <button
                                    className="btn btn-delete"
                                    onClick={() => {
                                        if (!confirm("정말 삭제하시겠습니까?")) return;
                                        del.mutate(item.idx, {
                                            onSuccess: () => Toast("success", "삭제되었습니다."),
                                            onError: () => Toast("error", "삭제에 실패했습니다."),
                                        });
                                    }}
                                    disabled={del.isPending}
                                >
                                    {del.isPending ? "삭제 중…" : "삭제"}
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="pagination">
                    <button disabled={page <= 1} onClick={() => go(page - 1)}>
                        이전
                    </button>
                    <span>{page}</span>
                    <button
                        disabled={(data?.length ?? 0) < size}
                        onClick={() => go(page + 1)}
                    >
                        다음
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default NewsPage;