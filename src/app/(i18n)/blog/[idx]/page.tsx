"use client";

import "./style.scss";
import Template from "src/components/common/template";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useBlogDetailQuery } from "src/queries/blog/blog.query";

const formatRelative = (dateStr: string, locale: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = d.getTime() - now.getTime();
    const absSec = Math.round(Math.abs(diffMs) / 1000);
    const rtf = new Intl.RelativeTimeFormat(locale.startsWith("ko") ? "ko" : "en", { numeric: "auto" });
    if (absSec < 60) return rtf.format(Math.round(diffMs / 1000), "second");
    const absMin = Math.round(absSec / 60);
    if (absMin < 60) return rtf.format(Math.round(diffMs / (60 * 1000)), "minute");
    const absHr = Math.round(absMin / 60);
    if (absHr < 24) return rtf.format(Math.round(diffMs / (60 * 60 * 1000)), "hour");
    const absDay = Math.round(absHr / 24);
    return rtf.format(Math.round(diffMs / (24 * 60 * 60 * 1000)), "day");
};

const BlogDetail = () => {
    const { idx } = useParams<{ idx: string }>();
    const idNum = Number(idx);
    const locale = useLocale();

    const { data, isLoading, isError } = useBlogDetailQuery(idNum);

    const title = data ? (locale.startsWith("ko") ? data.titleKr : data.titleEn) : "";
    const content = data ? (locale.startsWith("ko") ? data.contentKr : data.contentEn) : "";
    const time = data ? formatRelative(data.createdAt, locale) : "";

    return (
        <Template>
            <section className="BlogDetail">
                {!Number.isFinite(idNum) && <p className="BlogDetail__empty">잘못된 요청입니다. (idx 누락)</p>}
                {Number.isFinite(idNum) && (
                    <>
                        {isLoading && <p className="BlogDetail__loading">불러오는 중...</p>}
                        {isError && <p className="BlogDetail__empty">게시글을 불러오지 못했습니다.</p>}
                        {data && (
                            <article className="BlogDetail">
                                <h1 className="BlogDetail__title">{title}</h1>

                                <div className="BlogDetail__meta">
                                    <span className="BlogDetail__time">{time}</span>
                                    <span className="BlogDetail__dot">·</span>
                                    <span className="BlogDetail__views">{data.views.toLocaleString()} views</span>
                                </div>

                                {data.imageUrl && (
                                    <div className="BlogDetail__hero">
                                        <Image
                                            src={data.imageUrl}
                                            alt={title || "blog thumbnail"}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 960px"
                                            priority
                                        />
                                    </div>
                                )}

                                <div className="BlogDetail__content">{content}</div>
                            </article>
                        )}
                    </>
                )}
            </section>
        </Template>
    );
};

export default BlogDetail;