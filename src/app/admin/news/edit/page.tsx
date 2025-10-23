"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminLayout from "src/components/common/admin/layout";
import { useNewsDetailQuery, useNewsUpdateMutation } from "src/queries/news/news.query";
import { Toast } from "src/libs/toast/toast";
import "./style.scss";

const NewsEditPage = () => {
    const sp = useSearchParams();
    const router = useRouter();
    const idx = useMemo(() => Number(sp.get("idx")), [sp]);

    const { data, isLoading } = useNewsDetailQuery(idx);
    const { mutateAsync: updateAsync, isPending: updating } = useNewsUpdateMutation();

    const [titleKr, setTitleKr] = useState("");
    const [titleEn, setTitleEn] = useState("");
    const [newsUrl, setNewsUrl] = useState("");

    useEffect(() => {
        if (data) {
            setTitleKr(data.titleKr ?? "");
            setTitleEn(data.titleEn ?? "");
            setNewsUrl(data.newsUrl ?? "");
        }
    }, [data]);

    const save = async () => {
        if (!idx) return;
        if (!titleKr.trim()) {
            Toast("info", "국문 제목은 필수입니다.");
            return;
        }
        try {
            await updateAsync({ idx, titleKr, titleEn, newsUrl });
            Toast("success", "수정 완료");
            router.replace(`/admin/news/${idx}`);
        } catch {
            Toast("error", "수정 실패");
        }
    };

    if (!Number.isFinite(idx)) {
        return (
            <AdminLayout>
                <div className="news-edit-page"><p>잘못된 경로입니다.</p></div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="news-edit-page">
                <h1>뉴스 수정</h1>

                {isLoading && <p>불러오는 중...</p>}
                {!isLoading && !data && <p>데이터가 없습니다.</p>}

                {!isLoading && data && (
                    <div className="form">
                        <label>
                            <span>제목(국문)</span>
                            <input
                                value={titleKr}
                                onChange={(e) => setTitleKr(e.target.value)}
                                placeholder="국문 제목"
                            />
                        </label>

                        <label>
                            <span>제목(영문)</span>
                            <input
                                value={titleEn}
                                onChange={(e) => setTitleEn(e.target.value)}
                                placeholder="영문 제목"
                            />
                        </label>

                        <label>
                            <span>뉴스 URL</span>
                            <input
                                value={newsUrl}
                                onChange={(e) => setNewsUrl(e.target.value)}
                                placeholder="https://example.com/news"
                            />
                        </label>

                        <div className="buttons">
                            <button className="btn-primary" disabled={updating} onClick={save}>
                                {updating ? "저장 중..." : "저장"}
                            </button>
                            <button className="btn-cancel" onClick={() => router.back()}>
                                취소
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

export default NewsEditPage;