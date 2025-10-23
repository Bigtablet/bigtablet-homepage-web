"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "src/components/common/admin/layout";
import "./style.scss";
import { Toast } from "src/libs/toast/toast";
import { useBlogDetailQuery, useBlogDeleteMutation } from "src/queries/blog/blog.query";

const formatDate = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const BlogDetailPage = () => {
    const { idx: idxParam } = useParams<{ idx: string }>();
    const router = useRouter();
    const idx = useMemo(() => Number(idxParam), [idxParam]);

    const { data, isLoading, isError } = useBlogDetailQuery(idx);

    // 삭제: 완료 후 목록으로
    const del = useBlogDeleteMutation({
        onSuccess: () => {
            Toast("success", "삭제 완료");
            router.replace("/admin/blog");
        },
        onError: () => Toast("error", "삭제 실패"),
    });

    return (
        <AdminLayout>
            <main className="blog-detail">
                {isLoading ? (
                    <div className="blog-detail__empty">불러오는 중…</div>
                ) : isError || !data ? (
                    <div className="blog-detail__empty">게시글을 불러오지 못했습니다.</div>
                ) : (
                    <>
                        {/* 제목 + 액션 */}
                        <header className="blog-detail__header">
                            <h1 className="blog-detail__title">{data.titleKr}</h1>

                            <div className="actions">
                                {/* 수정으로 이동 */}
                                <Link href={`/admin/blog/edit?idx=${data.idx}`} className="btn">
                                    수정
                                </Link>
                                {/* 삭제 */}
                                <button
                                    className="btn btn--danger"
                                    onClick={() => {
                                        if (!confirm("정말 삭제하시겠습니까?")) return;
                                        del.mutate(data.idx);
                                    }}
                                    disabled={del.isPending}
                                >
                                    {del.isPending ? "삭제 중…" : "삭제"}
                                </button>
                            </div>
                        </header>

                        {/* 메타 */}
                        <div className="blog-detail__meta">
                            <span className="date">{formatDate(data.createdAt)}</span>
                            <span className="views">조회 {data.views?.toLocaleString?.() ?? 0}</span>
                        </div>

                        {/* 썸네일 */}
                        <section className="blog-detail__thumbwrap">
                            {data.imageUrl ? (
                                <img src={data.imageUrl} alt={data.titleKr} className="blog-detail__thumb" />
                            ) : (
                                <div className="blog-detail__thumb --placeholder">No Image</div>
                            )}
                        </section>

                        {/* 본문(한국어) */}
                        <section className="blog-detail__section">
                            <h2 className="blog-detail__subtitle">내용 (한국어)</h2>
                            <div className="blog-detail__content">{data.contentKr}</div>
                        </section>

                        {/* 본문(영문) */}
                        <section className="blog-detail__section">
                            <h2 className="blog-detail__subtitle">Content (English)</h2>

                            <div className="field-inline">
                                <label className="field__label">English Title</label>
                                <div className="blog-detail__text">{data.titleEn || "-"}</div>
                            </div>

                            <div className="blog-detail__content">{data.contentEn || "-"}</div>
                        </section>
                    </>
                )}
            </main>
        </AdminLayout>
    );
}

export default BlogDetailPage;