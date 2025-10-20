"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "src/components/common/admin/layout";
import "./style.scss";
import { Toast } from "src/libs/toast/toast";
import {
    useBlogDetailQuery,
    useBlogUpdateMutation,
    useBlogDeleteMutation,
} from "src/queries/blog/blog.query";
import { useGcpUploadMutation } from "src/queries/gcp/gcp.query";
import type { BlogUpdateRequest } from "src/types/blog/blog.type";

const formatDate = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const BlogDetail = () => {
    const params = useParams<{ idx: string }>();
    const router = useRouter();

    const idx = useMemo(() => Number(params?.idx), [params]);
    const { data, isLoading, isError } = useBlogDetailQuery(idx);

    // 폼 상태
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        titleKr: "",
        titleEn: "",
        contentKr: "",
        contentEn: "",
        imageUrl: "",
    });
    const [fileName, setFileName] = useState("");
    const [previewUrl, setPreviewUrl] = useState<string>("");

    useEffect(() => {
        if (data) {
            setForm({
                titleKr: data.titleKr ?? "",
                titleEn: data.titleEn ?? "",
                contentKr: data.contentKr ?? "",
                contentEn: data.contentEn ?? "",
                imageUrl: data.imageUrl ?? "",
            });
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl("");
            }
            setFileName("");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    /** GCP 이미지 업로드 */
    const upload = useGcpUploadMutation({
        onSuccess: (res) => {
            if (!res.data) {
                Toast("error", "이미지 업로드 실패");
                return;
            }
            setForm((prev) => ({ ...prev, imageUrl: res.data }));
            Toast("success", "이미지 업로드 완료");
        },
        onError: () => Toast("error", "이미지 업로드 실패"),
    });

    const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setFileName(f.name);

        // 로컬 미리보기
        const nextUrl = URL.createObjectURL(f);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(nextUrl);

        // 업로드 시작
        upload.mutate(f);
    };

    /** 블로그 수정 (저장 후 /admin/blog 이동) */
    const update = useBlogUpdateMutation({
        onSuccess: () => {
            Toast("success", "수정 완료");
            router.replace("/admin/blog");
        },
        onError: () => Toast("error", "수정 실패"),
    });

    /** 블로그 삭제 (삭제 후 /admin/blog 이동) */
    const remove = useBlogDeleteMutation({
        onSuccess: () => {
            Toast("success", "삭제 완료");
            router.replace("/admin/blog");
        },
        onError: () => Toast("error", "삭제 실패"),
    });

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((s) => ({ ...s, [name]: value }));
    };

    const onSave = () => {
        if (!data) return;
        if (!form.titleKr.trim() || !form.contentKr.trim()) {
            Toast("error", "한국어 제목/본문은 필수입니다.");
            return;
        }
        const body: BlogUpdateRequest = {
            idx: data.idx,
            titleKr: form.titleKr,
            titleEn: form.titleEn,
            contentKr: form.contentKr,
            contentEn: form.contentEn,
            imageUrl: form.imageUrl,
        };
        update.mutate(body);
    };

    const onDelete = () => {
        if (!data) return;
        if (!confirm("정말 삭제하시겠습니까?")) return;
        remove.mutate(data.idx);
    };

    const thumbSrc = editing ? (previewUrl || form.imageUrl) : data?.imageUrl || "";

    return (
        <AdminLayout>
            <main className="blog-detail">
                {isLoading ? (
                    <div className="blog-detail__empty">불러오는 중…</div>
                ) : isError || !data ? (
                    <div className="blog-detail__empty">게시글을 불러오지 못했습니다.</div>
                ) : (
                    <>
                        {/* 제목 & 액션 */}
                        <header className="blog-detail__header">
                            <div className="blog-detail__title-wrap">
                                <label className="field__label">제목 (한국어)</label>
                                {editing ? (
                                    <input
                                        className="blog-detail__title-input"
                                        name="titleKr"
                                        value={form.titleKr}
                                        onChange={onChange}
                                        placeholder="제목 (한국어)"
                                    />
                                ) : (
                                    <h1 className="blog-detail__title">{data.titleKr}</h1>
                                )}
                            </div>

                            <div className="actions">
                                {!editing ? (
                                    <>
                                        <button className="btn" onClick={() => setEditing(true)}>
                                            수정
                                        </button>
                                        <button
                                            className="btn btn--danger"
                                            onClick={onDelete}
                                            disabled={remove.isPending}
                                        >
                                            {remove.isPending ? "삭제 중…" : "삭제"}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            className="btn btn--primary"
                                            onClick={onSave}
                                            disabled={update.isPending}
                                        >
                                            {update.isPending ? "저장 중…" : "저장"}
                                        </button>
                                        <button
                                            className="btn"
                                            onClick={() => {
                                                setEditing(false);
                                                if (data) {
                                                    setForm({
                                                        titleKr: data.titleKr ?? "",
                                                        titleEn: data.titleEn ?? "",
                                                        contentKr: data.contentKr ?? "",
                                                        contentEn: data.contentEn ?? "",
                                                        imageUrl: data.imageUrl ?? "",
                                                    });
                                                }
                                                if (previewUrl) {
                                                    URL.revokeObjectURL(previewUrl);
                                                    setPreviewUrl("");
                                                }
                                                setFileName("");
                                            }}
                                            disabled={update.isPending}
                                        >
                                            취소
                                        </button>
                                    </>
                                )}
                            </div>
                        </header>

                        {/* 메타 */}
                        <div className="blog-detail__meta">
                            <span className="date">{formatDate(data.createdAt)}</span>
                            <span className="views">조회 {data.views?.toLocaleString?.() ?? 0}</span>
                        </div>

                        {/* 이미지 + 업로더 */}
                        <section className="blog-detail__thumbwrap">
                            {editing && (
                                <div className="upload">
                                    <label htmlFor="imageUpload" className="btn">이미지 선택</label>
                                    <input
                                        id="imageUpload"
                                        type="file"
                                        accept="image/*"
                                        onChange={onImageChange}
                                        disabled={upload.isPending}
                                    />
                                    <span className="file-name">
                    {upload.isPending ? "업로드 중…" : fileName || "선택된 파일 없음"}
                  </span>
                                </div>
                            )}

                            {thumbSrc ? (
                                <img
                                    src={thumbSrc}
                                    alt={form.titleKr || data.titleKr}
                                    className="blog-detail__thumb"
                                />
                            ) : (
                                <div className="blog-detail__thumb --placeholder">No Image</div>
                            )}
                        </section>

                        {/* 본문(한국어) */}
                        <section className="blog-detail__section">
                            <h2 className="blog-detail__subtitle">내용 (한국어)</h2>
                            {editing ? (
                                <textarea
                                    className="blog-detail__textarea"
                                    name="contentKr"
                                    value={form.contentKr}
                                    onChange={onChange}
                                    rows={12}
                                    placeholder="한국어 본문을 입력하세요"
                                />
                            ) : (
                                <div className="blog-detail__content">{data.contentKr}</div>
                            )}
                        </section>

                        {/* 본문(영문) */}
                        <section className="blog-detail__section">
                            <h2 className="blog-detail__subtitle">Content (English)</h2>

                            <div className="field-inline">
                                <label className="field__label">English Title</label>
                                {editing ? (
                                    <input
                                        className="blog-detail__input"
                                        name="titleEn"
                                        value={form.titleEn}
                                        onChange={onChange}
                                        placeholder="English title"
                                    />
                                ) : (
                                    <div className="blog-detail__text">{data.titleEn || "-"}</div>
                                )}
                            </div>

                            {editing ? (
                                <textarea
                                    className="blog-detail__textarea"
                                    name="contentEn"
                                    value={form.contentEn}
                                    onChange={onChange}
                                    rows={12}
                                    placeholder="Write your English content here"
                                />
                            ) : (
                                <div className="blog-detail__content">{data.contentEn || "-"}</div>
                            )}
                        </section>
                    </>
                )}
            </main>
        </AdminLayout>
    );
};

export default BlogDetail;