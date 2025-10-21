"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import AdminLayout from "src/components/common/admin/layout";
import {useNewsCreateMutation} from "src/queries/news/news.query";
import {Toast} from "src/libs/toast/toast";
import "./style.scss";

const NewsCreate = () => {
    const router = useRouter();
    const {mutateAsync, isPending} = useNewsCreateMutation();
    const [titleKr, setTitleKr] = useState("");
    const [titleEn, setTitleEn] = useState("");
    const [newsUrl, setNewsUrl] = useState("");

    const submit = async () => {
        if (!titleKr || !titleEn || !newsUrl) {
            Toast("error", "모든 항목을 입력해주세요");
            return;
        }
        try {
            await mutateAsync({titleKr, titleEn, newsUrl});
            Toast("success", "등록 완료");
            router.push("/admin/news");
        } catch {
            Toast("error", "등록 실패");
        }
    };

    return (
        <AdminLayout>
            <div className="news-create-page">
                <h1>뉴스 등록</h1>

                <div className="form">
                    <label>
                        <span>제목(국문)</span>
                        <input value={titleKr} onChange={(e) => setTitleKr(e.target.value)}/>
                    </label>

                    <label>
                        <span>제목(영문)</span>
                        <input value={titleEn} onChange={(e) => setTitleEn(e.target.value)}/>
                    </label>

                    <label>
                        <span>뉴스 URL</span>
                        <input value={newsUrl} onChange={(e) => setNewsUrl(e.target.value)}/>
                    </label>
                </div>

                <div className="buttons">
                    <button className="btn-primary" onClick={submit} disabled={isPending}>
                        {isPending ? "등록 중..." : "등록"}
                    </button>
                    <button className="btn-cancel" onClick={() => router.back()}>
                        취소
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default NewsCreate;