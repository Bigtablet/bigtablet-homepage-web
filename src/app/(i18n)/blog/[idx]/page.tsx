"use client";

import "./style.scss";
import Template from "src/shared/ui/template";
import Image from "next/image";
import {useEffect, useRef} from "react";
import {useParams} from "next/navigation";
import {useLocale} from "next-intl";
import {useBlogDetailQuery } from "src/entities/blog/queries/blog.query";
import {useBlogViewMutation} from "src/entities/blog/mutation/blog.mutation";
import {formatRelative} from "src/shared/libs/ui/date";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const BlogDetailPage = () => {
    const {idx} = useParams<{ idx: string }>();
    const idNum = Number(idx);
    const locale = useLocale();

    const {data, isLoading, isError} = useBlogDetailQuery(idNum);

    // 조회수 증가
    const {mutate: incView} = useBlogViewMutation();
    const firedRef = useRef(false);
    useEffect(() => {
        if (!firedRef.current && Number.isFinite(idNum) && idNum > 0) {
            firedRef.current = true;
            incView(idNum);
        }
    }, [idNum, incView]);

    const title = data ? (locale.startsWith("ko") ? data.titleKr : data.titleEn) : "";
    const content = data ? (locale.startsWith("ko") ? data.contentKr : data.contentEn) : "";
    const time = data ? formatRelative(data.createdAt, locale) : "";

    return (
        <Template>
            <section className="blog-detail">
                {!Number.isFinite(idNum) && <p className="blog-detail__empty">잘못된 요청입니다. (idx 누락)</p>}

                {Number.isFinite(idNum) && (
                    <>
                        {isLoading && <p className="blog-detail__loading">불러오는 중...</p>}
                        {isError && <p className="blog-detail__empty">게시글을 불러오지 못했습니다.</p>}

                        {data && (
                            <article className="blog-detail__body">
                                <h1 className="blog-detail__title">{title}</h1>

                                <div className="blog-detail__meta">
                                    <span className="blog-detail__time">{time}</span>
                                    <span className="blog-detail__dot">·</span>
                                    <span className="blog-detail__views">
                    {(data.views ?? 0).toLocaleString()} views
                  </span>
                                </div>

                                {data.imageUrl && (
                                    <div className="blog-detail__hero">
                                        <Image
                                            src={data.imageUrl}
                                            alt={title || "blog thumbnail"}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 960px"
                                            priority
                                        />
                                    </div>
                                )}

                                <div className="blog-detail__content">
                                    <ReactMarkdown rehypePlugins={[remarkGfm]}>
                                        {content}
                                    </ReactMarkdown>
                                </div>
                            </article>
                        )}
                    </>
                )}
            </section>
        </Template>
    );
};

export default BlogDetailPage;