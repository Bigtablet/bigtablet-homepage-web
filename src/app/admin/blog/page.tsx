"use client";

import { useMemo } from "react";
import Link from "next/link";
import "./style.scss";
import AdminLayout from "src/components/common/admin/layout";
import { useBlogInfiniteQuery, useBlogDeleteMutation } from "src/queries/blog/blog.query";
import type { BlogItem } from "src/types/blog/blog.type";
import { useQueryClient } from "@tanstack/react-query";
import { Toast } from "src/libs/toast/toast";
import { QueryKey } from "src/queries/queryKey";

const formatDate = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const SIZE = 10;

const BlogList = () => {
    const queryClient = useQueryClient();
    const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } =
        useBlogInfiniteQuery(SIZE);

    const items = useMemo<BlogItem[]>(() => (data?.pages ?? []).flat(), [data]);

    // 삭제
    const del = useBlogDeleteMutation({
        onSuccess: () => {
            Toast("success", "삭제되었습니다.");
            queryClient.invalidateQueries({ queryKey: [QueryKey.blog.list] });
        },
        onError: () => Toast("error", "삭제에 실패했습니다."),
    });

    return (
        <AdminLayout>
            <main className="blog-list">
                <header className="blog-list__header">
                    <h1 className="blog-list__title">블로그</h1>
                    {/* 작성 바로가기 */}
                    <Link href="/admin/blog/create" className="btn btn--primary">
                        새 글 작성
                    </Link>
                </header>

                {isLoading ? (
                    <div className="blog-list__empty">불러오는 중…</div>
                ) : isError ? (
                    <div className="blog-list__empty">목록을 불러오지 못했습니다.</div>
                ) : !items.length ? (
                    <div className="blog-list__empty">등록된 글이 없습니다.</div>
                ) : (
                    <>
                        <ul className="blog-list__grid">
                            {items.map((post) => (
                                <li key={post.idx} className="blog-card">
                                    {/* 본문 전체를 감싸는 링크(카드의 가변 영역) */}
                                    <Link href={`/admin/blog/${post.idx}`} className="blog-card__link">
                                        <div className="blog-card__thumb-wrap">
                                            {post.imageUrl ? (
                                                <img src={post.imageUrl} alt={post.titleKr} className="blog-card__thumb" />
                                            ) : (
                                                <div className="blog-card__thumb blog-card__thumb--placeholder">No Image</div>
                                            )}
                                        </div>

                                        <div className="blog-card__body">
                                            <h2 className="blog-card__title">{post.titleKr}</h2>
                                            <p className="blog-card__excerpt">{post.contentKr}</p>
                                            <div className="blog-card__meta">
                                                <span className="date">{formatDate(post.createdAt)}</span>
                                                <span className="views">조회 {post.views?.toLocaleString?.() ?? 0}</span>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* 카드 하단 고정 액션(링크 바깥, 클릭 전파 방지) */}
                                    <div className="blog-card__actions" onClick={(e) => e.stopPropagation()}>
                                        <Link href={`/admin/blog/edit?idx=${post.idx}`} className="btn">
                                            수정
                                        </Link>
                                        <button
                                            className="btn btn--danger"
                                            onClick={() => {
                                                if (!post.idx) return;
                                                if (confirm("정말 삭제하시겠습니까?")) del.mutate(post.idx);
                                            }}
                                            disabled={del.isPending}
                                        >
                                            {del.isPending ? "삭제 중…" : "삭제"}
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="blog-list__more">
                            {hasNextPage ? (
                                <button className="btn" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                                    {isFetchingNextPage ? "불러오는 중…" : "더 보기"}
                                </button>
                            ) : (
                                <span className="blog-list__end">마지막 글입니다.</span>
                            )}
                        </div>
                    </>
                )}
            </main>
        </AdminLayout>
    );
};

export default BlogList;