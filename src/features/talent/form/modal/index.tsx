"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
    PostTalent,
    PostTalentFormValues,
} from "src/entities/talent/model/schema/talent.schema";
import { useTalentMutation } from "src/entities/talent/mutation/talent.mutation";
import {FileInput} from "src/shared/ui/form/file";
import styles from "./style.module.scss";
import {useGcpUploadMutation} from "src/shared/gcp/mutation/gcp.query";
import {useToast} from "@bigtablet/design-system";

interface Props {
    open: boolean;
    onClose: () => void;
}

/** URL 자동 https 붙이는 함수 */
const ensureHttps = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
};

type PortfolioMode = "link" | "file";

const TalentFormModal = ({ open, onClose }: Props) => {
    const Toast = useToast();
    const { mutateAsync: createTalent, isPending } = useTalentMutation();
    const {
        mutateAsync: uploadFile,
        isPending: isUploading,
    } = useGcpUploadMutation();

    const [portfolioMode, setPortfolioMode] = useState<PortfolioMode>("link");

    const {
        control,
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        clearErrors,
        formState: { errors },
    } = useForm<PostTalentFormValues>({
        defaultValues: {
            email: "",
            name: "",
            department: "",
            portfolioUrl: "",
            etcUrl: [""],
        },
        mode: "onBlur",
        shouldUnregister: false,
    });

    const { fields, append, remove } = useFieldArray<any>({
        control: control as any,
        name: "etcUrl",
    });

    const watchPortfolioUrl = watch("portfolioUrl");

    /** 포트폴리오 파일 업로드 핸들러 */
    const handlePortfolioFile = async (file: File | null) => {
        if (!file) return;
        try {
            const res = await uploadFile(file);
            const url = res.data ?? "";
            setValue("portfolioUrl", url, { shouldValidate: true });
            clearErrors("portfolioUrl");
        } catch (err) {
            Toast.error("파일은 jpg")

            setValue("portfolioUrl", "", { shouldValidate: true });
        }
    };

    const onSubmit = async (values: PostTalentFormValues) => {
        const filtered = values.etcUrl
            .filter((v) => v.trim() !== "")
            .map((u) => ensureHttps(u));

        const payload: PostTalent = {
            email: values.email,
            name: values.name,
            department: values.department,
            portfolioUrl: ensureHttps(values.portfolioUrl),
            ...(filtered.length > 0 ? { etcUrl: filtered } : {}),
        };

        try {
            await createTalent(payload);

            Toast.success("등록이 완료되었습니다.");

            reset();
            setPortfolioMode("link");
            onClose();
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "등록 중 오류가 발생했습니다.";

            Toast.error(message);
        }
    };
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "auto";
    }, [open]);

    if (!open) return null;

    const isFormBusy = isPending || isUploading;

    return (
        <div className={styles.modal_overlay}>
            <div className={styles.modal_content}>
                <h2>인재풀 등록</h2>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <label>
                        이름
                        <input
                            {...register("name", { required: "이름을 입력해주세요." })}
                            placeholder="이름을 입력하세요"
                            disabled={isFormBusy}
                        />
                        {errors.name && (
                            <p className={styles.error}>{errors.name.message}</p>
                        )}
                    </label>

                    <label>
                        이메일
                        <input
                            {...register("email", {
                                required: "이메일을 입력해주세요.",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "유효한 이메일 형식이 아닙니다.",
                                },
                            })}
                            placeholder="example@bigtablet.kr"
                            disabled={isFormBusy}
                        />
                        {errors.email && (
                            <p className={styles.error}>{errors.email.message}</p>
                        )}
                    </label>

                    <label>
                        희망 직무
                        <input
                            {...register("department", {
                                required: "희망 직무를 입력해주세요.",
                            })}
                            placeholder="예: 개발팀"
                            disabled={isFormBusy}
                        />
                        {errors.department && (
                            <p className={styles.error}>{errors.department.message}</p>
                        )}
                    </label>

                    {/* 포트폴리오 링크 / 파일 선택 영역 */}
                    <label className={styles.portfolio}>
                        <div className={styles.portfolio_header}>
                            <span>포트폴리오</span>
                            <div className={styles.portfolio_toggle}>
                                <button
                                    type="button"
                                    className={
                                        portfolioMode === "link"
                                            ? styles.portfolio_toggle_active
                                            : styles.portfolio_toggle_button
                                    }
                                    onClick={() => setPortfolioMode("link")}
                                    disabled={isFormBusy}
                                >
                                    링크 입력
                                </button>
                                <button
                                    type="button"
                                    className={
                                        portfolioMode === "file"
                                            ? styles.portfolio_toggle_active
                                            : styles.portfolio_toggle_button
                                    }
                                    onClick={() => {
                                        setPortfolioMode("file");
                                        setValue("portfolioUrl", "", {
                                            shouldValidate: false,
                                        });
                                    }}
                                    disabled={isFormBusy}
                                >
                                    파일 업로드
                                </button>
                            </div>
                        </div>

                        {portfolioMode === "link" && (
                            <input
                                {...register("portfolioUrl", {
                                    required:
                                        "포트폴리오 URL을 입력하거나 파일을 업로드해주세요.",
                                })}
                                placeholder="https://portfolio.example.com"
                                disabled={isFormBusy}
                            />
                        )}

                        {portfolioMode === "file" && (
                            <div className={styles.portfolio_file}>
                                <FileInput
                                    label={isUploading ? "업로드 중..." : "파일 선택"}
                                    onFiles={handlePortfolioFile}
                                    disabled={isFormBusy}
                                    // 필요하면 accept 지정
                                    // accept=".pdf,.ppt,.pptx,.zip,image/*"
                                />
                                {watchPortfolioUrl && (
                                    <p className={styles.helper}>
                                        업로드된 URL: {watchPortfolioUrl}
                                    </p>
                                )}
                            </div>
                        )}

                        {errors.portfolioUrl && (
                            <p className={styles.error}>
                                {errors.portfolioUrl.message}
                            </p>
                        )}
                    </label>

                    <div className={styles.urls}>
                        <span>기타 URL</span>

                        {fields.map((field, index) => (
                            <div key={field.id} className={styles.url_row}>
                                <input
                                    {...register(`etcUrl.${index}`)}
                                    placeholder="예: github.com/user"
                                    disabled={isFormBusy}
                                />

                                {index > 0 && (
                                    <button
                                        type="button"
                                        className={styles.url_remove}
                                        onClick={() => remove(index)}
                                        disabled={isFormBusy}
                                    >
                                        삭제
                                    </button>
                                )}

                                {errors.etcUrl?.[index] && (
                                    <p className={styles.error}>
                                        {errors.etcUrl[index]?.message}
                                    </p>
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            className={styles.url_add}
                            onClick={() => append("")}
                            disabled={isFormBusy}
                        >
                            + URL 추가
                        </button>
                    </div>

                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} disabled={isFormBusy}>
                            취소
                        </button>
                        <button type="submit" disabled={isFormBusy}>
                            {isPending ? "등록 중..." : "등록하기"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TalentFormModal;