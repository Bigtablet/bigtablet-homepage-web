"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
    PostTalent,
    PostTalentFormValues,
} from "src/entities/talent/model/schema/talent.schema";
import { useTalentMutation } from "src/entities/talent/mutation/talent.mutation";
import styles from "./style.module.scss";

interface Props {
    open: boolean;
    onClose: () => void;
}

// URL 자동 https 붙이는 함수
const ensureHttps = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
};

const TalentFormModal = ({ open, onClose }: Props) => {
    const { mutateAsync: createTalent, isPending } = useTalentMutation();

    const {
        control,
        register,
        handleSubmit,
        reset,
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
    });

    const { fields, append, remove } = useFieldArray<any>({
        control: control as any,
        name: "etcUrl",
    });

    const onSubmit = async (values: PostTalentFormValues) => {
        // https 자동 붙이기
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

        await createTalent(payload);
        reset();
        onClose();
    };

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "auto";
    }, [open]);

    if (!open) return null;

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
                        />
                        {errors.email && (
                            <p className={styles.error}>{errors.email.message}</p>
                        )}
                    </label>

                    <label>
                        희망 부서
                        <input
                            {...register("department", {
                                required: "희망 부서를 입력해주세요.",
                            })}
                            placeholder="예: 개발팀"
                        />
                        {errors.department && (
                            <p className={styles.error}>{errors.department.message}</p>
                        )}
                    </label>

                    <label>
                        포트폴리오 URL
                        <input
                            {...register("portfolioUrl", {
                                required: "포트폴리오 URL을 입력해주세요.",
                            })}
                            placeholder="https://portfolio.example.com"
                        />
                        {errors.portfolioUrl && (
                            <p className={styles.error}>{errors.portfolioUrl.message}</p>
                        )}
                    </label>

                    <div className={styles.urls}>
                        <span>기타 URL</span>

                        {fields.map((field, index) => (
                            <div key={field.id} className={styles.url_row}>
                                <input
                                    {...register(`etcUrl.${index}`)}
                                    placeholder="예: github.com/user"
                                />

                                {index > 0 && (
                                    <button
                                        type="button"
                                        className={styles.url_remove}
                                        onClick={() => remove(index)}
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
                        >
                            + URL 추가
                        </button>
                    </div>

                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} disabled={isPending}>
                            취소
                        </button>
                        <button type="submit" disabled={isPending}>
                            등록하기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TalentFormModal;