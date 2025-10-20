"use client";

import {useMemo} from "react";
import Link from "next/link";
import "./style.scss";
import {useBlogInfiniteQuery} from "src/queries/blog/blog.query";
import type {BlogItem} from "src/types/blog/blog.type";
import AdminLayout from "src/components/common/admin/layout";

const formatDate = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const SIZE = 10;

const BlogList = () => {
    const {data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage} =
        useBlogInfiniteQuery(SIZE);

    const items = useMemo<BlogItem[]>(
        () => (data?.pages ?? []).flat(),
        [data]
    );

    return (
        <AdminLayout>
            <main className="blog-list">
                <header className="blog-list__header">
                    <h1 className="blog-list__title">블로그</h1>
                    {/* 필요 시 작성 버튼 노출 (관리자 전용일 경우 조건 처리) */}
                    {/* <Link href="/blog/create" className="btn btn--primary">새 글 작성</Link> */}
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
                                    <Link href={`/admin/blog/${post.idx}`} className="blog-card__link">
                                        <div className="blog-card__thumb-wrap">
                                            {/* 이미지 없을 때 대비 */}
                                            {post.imageUrl ? (
                                                <img src={post.imageUrl} alt={post.titleKr}
                                                     className="blog-card__thumb"/>
                                            ) : (
                                                <div className="blog-card__thumb --placeholder">No Image</div>
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
                                </li>
                            ))}
                        </ul>

                        <div className="blog-list__more">
                            {hasNextPage ? (
                                <button
                                    className="btn"
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                >
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