"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "src/components/common/admin/layout";
import "./style.scss";
import { Toast } from "src/libs/toast/toast";
import { useGcpUploadMutation } from "src/queries/gcp/gcp.query";
import { useBlogCreateMutation } from "src/queries/blog/blog.query";
import { QueryKey } from "src/queries/queryKey";
import type { BlogCreateRequest } from "src/types/blog/blog.type";

type FormState = BlogCreateRequest;

const BlogCreate = () => {
    const router = useRouter();
    const qc = useQueryClient();

    const [form, setForm] = useState<FormState>({
        titleKr: "",
        titleEn: "",
        contentKr: "",
        contentEn: "",
        imageUrl: "",
    });
    const [fileName, setFileName] = useState("");

    const upload = useGcpUploadMutation({
        onSuccess: (res) => {
            setForm((prev) => ({ ...prev, imageUrl: res.data }));
            Toast("success", "이미지 업로드 완료");
        },
        onError: () => Toast("error", "이미지 업로드 실패"),
    });

    const create = useBlogCreateMutation({
        onSuccess: async () => {
            Toast("success", "블로그가 등록되었습니다.");
            await qc.invalidateQueries({ queryKey: [QueryKey.blog.list] });
            router.replace("/admin/blog");
        },
        onError: () => Toast("error", "등록에 실패했습니다."),
    });

    const resetForm = () =>
        setForm({
            titleKr: "",
            titleEn: "",
            contentKr: "",
            contentEn: "",
            imageUrl: "",
        });

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setFileName(f.name);
        upload.mutate(f);
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!form.titleKr?.trim() || !form.contentKr?.trim()) {
            Toast("error", "한국어 제목/본문은 필수입니다.");
            return;
        }

        const body: BlogCreateRequest = { ...form };
        create.mutate(body);
    };

    return (
        <AdminLayout>
            <main className="blog-admin">
                <div className="blog-admin__header">
                    <h1 className="blog-admin__title">블로그 작성</h1>
                </div>

                <form className="blog-admin__form" onSubmit={onSubmit} noValidate>
                    <div className="field">
                        <label>제목 (한국어)</label>
                        <input
                            type="text"
                            name="titleKr"
                            placeholder="예: 스프링 부트 REST API 설계하기"
                            value={form.titleKr}
                            onChange={onChange}
                        />
                    </div>

                    <div className="field">
                        <label>제목 (영문)</label>
                        <input
                            type="text"
                            name="titleEn"
                            placeholder="예: Spring Boot REST API Design"
                            value={form.titleEn}
                            onChange={onChange}
                        />
                    </div>

                    <div className="field">
                        <label>내용 (한국어)</label>
                        <textarea
                            name="contentKr"
                            placeholder="한국어 본문을 입력하세요"
                            value={form.contentKr}
                            onChange={onChange}
                            rows={8}
                        />
                    </div>

                    <div className="field">
                        <label>내용 (영문)</label>
                        <textarea
                            name="contentEn"
                            placeholder="Write your English content here"
                            value={form.contentEn}
                            onChange={onChange}
                            rows={8}
                        />
                    </div>

                    <div className="blog-admin__image">
                        <label>대표 이미지</label>
                        {form.imageUrl && <img src={form.imageUrl} alt="preview" className="preview" />}
                        <div className="upload">
                            <label htmlFor="imageUpload" className="btn">이미지 선택</label>
                            <input id="imageUpload" type="file" accept="image/*" onChange={onImageChange} />
                            <span className="file-name">{fileName || "선택된 파일 없음"}</span>
                        </div>
                    </div>

                    <div className="actions">
                        <button
                            type="submit"
                            className="btn btn--primary"
                            disabled={create.isPending}
                        >
                            {create.isPending ? "등록 중…" : "등록"}
                        </button>
                        <button
                            type="button"
                            className="btn"
                            onClick={resetForm}
                            disabled={create.isPending}
                        >
                            초기화
                        </button>
                    </div>
                </form>
            </main>
        </AdminLayout>
    );
};

export default BlogCreate;