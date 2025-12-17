"use client";

import * as React from "react";
import styles from "./style.module.scss";

export interface FileInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    label?: string;
    layout?: "row" | "column";
    onFiles?: (file: File | null) => void;
}

export const FileInput = ({
                              label = "파일 선택",
                              layout = "column",
                              className,
                              onFiles,
                              accept,
                              disabled,
                              ...props
                          }: FileInputProps) => {
    const id = React.useId();
    const [fileName, setFileName] = React.useState("선택된 파일 없음");
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const rootClass = [
        styles.file,
        layout === "row" && styles.file_row,
        layout === "column" && styles.file_column,
        className,
    ]
        .filter(Boolean)
        .join(" ");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.currentTarget.files?.[0] ?? null;

        setFileName(file?.name ?? "선택된 파일 없음");
        onFiles?.(file);

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }

        if (file && file.type.startsWith("image/")) {
            setPreviewUrl(URL.createObjectURL(file));
        }

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <div className={rootClass}>
            {layout === "column" && previewUrl && (
                <div className={styles.file_preview}>
                    <img src={previewUrl} alt="미리보기" />
                </div>
            )}

            <div className={styles.file_control}>
                <input
                    ref={inputRef}
                    id={id}
                    type="file"
                    className={styles.file_input}
                    accept={accept}
                    disabled={disabled}
                    onChange={handleChange}
                    {...props}
                />

                <label htmlFor={id} className={styles.file_label}>
                    {label}
                </label>

                <span className={styles.file_name}>{fileName}</span>
            </div>
        </div>
    );
};