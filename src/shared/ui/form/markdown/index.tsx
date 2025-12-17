"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./style.module.scss";

type MarkdownEditorProps = {
    label?: string;
    placeholder?: string;
    value: string;
    onChangeAction: (val: string) => void;
    rows?: number;
};

export const MarkdownEditor = ({
                                   label,
                                   placeholder,
                                   value,
                                   onChangeAction,
                                   rows = 14,
                               }: MarkdownEditorProps) => {
    const id = React.useId();

    return (
        <div className={styles.md}>
            {label && (
                <label className={styles.md_label} htmlFor={id}>
                    {label}
                </label>
            )}

            <div className={styles.md_grid}>
                <textarea
                    id={id}
                    className={styles.md_input}
                    rows={rows}
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => onChangeAction(e.target.value)}
                />

                <div className={`${styles.md_preview} ${styles.markdown_body}`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {value || "미리보기 영역입니다. 마크다운을 입력하세요."}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
};

export default MarkdownEditor;