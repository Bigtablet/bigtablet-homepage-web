"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { notFound } from "next/navigation";
import { useLocale } from "next-intl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useBlogDetailQuery } from "src/entities/blog/queries/blog.query";
import { useBlogViewMutation } from "src/entities/blog/mutation/blog.mutation";
import { formatRelative } from "src/shared/libs/ui/date";

import styles from "./style.module.scss";

type Props = {
    idx: number;
};

const BlogDetailClient = ({ idx }: Props) => {
    /**
     * 모든 Hook은 조건 없이 최상단에서 호출
     * - 렌더마다 Hook 순서를 고정하기 위함
     */
    const locale = useLocale();
    const { data, isLoading, isError } = useBlogDetailQuery(idx);
    const { mutate: incView } = useBlogViewMutation();
    const firedRef = useRef(false);

    /**
     * 조회수 증가는 데이터가 준비된 뒤 최초 1회만 실행
     * - isLoading 단계에서는 실행하지 않음
     * - 리렌더링되어도 중복 호출 방지
     */
    useEffect(() => {
        if (!data) return;
        if (firedRef.current) return;

        firedRef.current = true;
        incView(idx);
    }, [data, idx, incView]);

    /**
     * 로딩 중
     * - Template 레벨에서 공통 로딩 처리
     * - 여기서는 아무것도 렌더링하지 않음
     */
    if (isLoading) return null;

    /**
     * 네트워크 / 서버 에러
     * - 전역 error.tsx로 위임
     */
    if (isError) throw new Error("Failed to load blog detail");

    /**
     * 정상 요청이지만 데이터가 없는 경우
     * - 존재하지 않는 리소스 → 404
     */
    if (!data) notFound();

    const title = locale.startsWith("ko") ? data.titleKr : data.titleEn;
    const content = locale.startsWith("ko") ? data.contentKr : data.contentEn;
    const time = formatRelative(data.createdAt, locale);

    return (
        <section className={styles.blog_detail}>
            <article className={styles.blog_detail_body}>
                <h1 className={styles.blog_detail_title}>{title}</h1>

                <div className={styles.blog_detail_meta}>
                    <span className={styles.blog_detail_time}>{time}</span>
                    <span className={styles.blog_detail_dot}>·</span>
                    <span className={styles.blog_detail_views}>
                        {(data.views ?? 0).toLocaleString()} views
                    </span>
                </div>

                {data.imageUrl && (
                    <div className={styles.blog_detail_hero}>
                        <Image
                            src={data.imageUrl}
                            alt={title || "blog thumbnail"}
                            fill
                            sizes="(max-width: 768px) 100vw, 960px"
                            priority
                        />
                    </div>
                )}

                <div className={styles.blog_detail_content}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {content}
                    </ReactMarkdown>
                </div>
            </article>
        </section>
    );
};

export default BlogDetailClient;