"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "src/components/common/admin/layout";
import { useNewsDeleteMutation, useNewsDetailQuery, useNewsUpdateMutation } from "src/queries/news/news.query";
import { Toast } from "src/libs/toast/toast";
import "./style.scss";

const NewsDetail = () => {
    const params = useParams<{ idx: string }>();
    const idx = useMemo(() => Number(params?.idx), [params]);
    const router = useRouter();

    const { data, isLoading } = useNewsDetailQuery(idx);
    const { mutateAsync: updateAsync, isPending: updating } = useNewsUpdateMutation();
    const { mutateAsync: deleteAsync, isPending: deleting } = useNewsDeleteMutation();

    const [titleKr, setTitleKr] = useState("");
    const [titleEn, setTitleEn] = useState("");
    const [newsUrl, setNewsUrl] = useState("");
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        if (data) {
            setTitleKr(data.titleKr ?? "");
            setTitleEn(data.titleEn ?? "");
            setNewsUrl(data.newsUrl ?? "");
        }
    }, [data]);

    const enterEdit = () => setEditMode(true);

    const cancelEdit = () => {
        if (!data) return;
        setTitleKr(data.titleKr ?? "");
        setTitleEn(data.titleEn ?? "");
        setNewsUrl(data.newsUrl ?? "");
        setEditMode(false);
    };

    const save = async () => {
        try {
            await updateAsync({ idx, titleKr, titleEn, newsUrl });
            Toast("success", "수정 완료");
            setEditMode(false);
        } catch {
            Toast("error", "수정 실패");
        }
    };

    const remove = async () => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        try {
            await deleteAsync(idx);
            Toast("success", "삭제 완료");
            router.replace("/admin/news");
        } catch {
            Toast("error", "삭제 실패");
        }
    };

    if (!Number.isFinite(idx)) {
        return (
            <AdminLayout>
                <div className="news-detail-page"><p>잘못된 경로입니다.</p></div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="news-detail-page">
                <h1>뉴스 상세</h1>

                {isLoading && <p>불러오는 중...</p>}

                {!isLoading && !data && <p>데이터가 없습니다.</p>}

                {!isLoading && data && (
                    <>
                        {!editMode ? (
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
                                            <a className="value link mono" href={data.newsUrl} target="_blank" rel="noreferrer">
                                                {data.newsUrl}
                                            </a>
                                        ) : (
                                            <span className="value">-</span>
                                        )}
                                    </div>
                                </div>

                                <div className="buttons">
                                    <button className="btn-primary" onClick={enterEdit}>수정</button>
                                    <button className="btn-danger" disabled={deleting} onClick={remove}>
                                        {deleting ? "삭제 중..." : "삭제"}
                                    </button>
                                    <button className="btn-cancel" onClick={() => router.back()}>뒤로가기</button>
                                </div>
                            </div>
                        ) : (
                            <div className="form">
                                <label>
                                    <span>제목(국문)</span>
                                    <input value={titleKr} onChange={(e) => setTitleKr(e.target.value)} />
                                </label>
                                <label>
                                    <span>제목(영문)</span>
                                    <input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
                                </label>
                                <label>
                                    <span>뉴스 URL</span>
                                    <input value={newsUrl} onChange={(e) => setNewsUrl(e.target.value)} />
                                </label>

                                <div className="buttons">
                                    <button className="btn-primary" disabled={updating} onClick={save}>
                                        {updating ? "저장 중..." : "저장"}
                                    </button>
                                    <button className="btn-cancel" onClick={cancelEdit}>취소</button>
                                    <button className="btn-cancel" onClick={() => router.back()}>뒤로가기</button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AdminLayout>
    );
};

export default NewsDetail;