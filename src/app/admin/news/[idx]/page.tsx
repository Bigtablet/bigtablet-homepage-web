"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "src/components/common/admin/layout";
import { useNewsDeleteMutation, useNewsDetailQuery } from "src/queries/news/news.query";
import { Toast } from "src/libs/toast/toast";
import "./style.scss";

const formatDate = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    const p = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`;
};

const NewsDetailPage = () => {
    const params = useParams<{ idx: string }>();
    const router = useRouter();
    const idx = useMemo(() => Number(params?.idx), [params]);

    const { data, isLoading } = useNewsDetailQuery(idx);
    const { mutateAsync: deleteAsync, isPending: deleting } = useNewsDeleteMutation();

    if (!Number.isFinite(idx)) {
        return (
            <AdminLayout>
                <div className="news-detail-page"><p>잘못된 경로입니다.</p></div>
            </AdminLayout>
        );
    }

    const onDelete = async () => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        try {
            await deleteAsync(idx);
            Toast("success", "삭제 완료");
            router.replace("/admin/news");
        } catch {
            Toast("error", "삭제 실패");
        }
    };

    return (
        <AdminLayout>
            <div className="news-detail-page">
                <h1>뉴스 상세</h1>

                {isLoading && <p>불러오는 중...</p>}
                {!isLoading && !data && <p>데이터가 없습니다.</p>}

                {!isLoading && data && (
                    <>
                        <div className="detail-view">
                            <div className="card">
                                <div className="row">
                                    <span className="label">제목(국문)</span>
                                    <span className="value">{data.titleKr || "-"}</span>
                                </div>
                                <div className="row">
                                    <span className="label">제목(영문)</span>
                                    <span className="value">{data.titleEn || "-"}</span>
                                </div>
                                <div className="row">
                                    <span className="label">뉴스 URL</span>
                                    {data.newsUrl ? (
                                        <a
                                            className="value link mono"
                                            href={data.newsUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {data.newsUrl}
                                        </a>
                                    ) : (
                                        <span className="value">-</span>
                                    )}
                                </div>
                                <div className="row">
                                    <span className="label">작성일</span>
                                    <span className="value">{formatDate(data.createdAt)}</span>
                                </div>
                            </div>

                            <div className="buttons">
                                {/* 수정으로 이동 */}
                                <Link href={`/admin/news/edit?idx=${data.idx}`} className="btn-primary">
                                    수정
                                </Link>
                                <button className="btn-danger" disabled={deleting} onClick={onDelete}>
                                    {deleting ? "삭제 중..." : "삭제"}
                                </button>
                                <button className="btn-cancel" onClick={() => router.back()}>
                                    뒤로가기
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
}

export default NewsDetailPage;