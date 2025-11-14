"use client";

import * as React from "react";
import "./style.scss";

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

    const classes = ["file", `file--${layout}`, className].filter(Boolean).join(" ");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.currentTarget.files?.[0] ?? null;
        setFileName(file?.name ?? "선택된 파일 없음");
        onFiles?.(file);

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }

        if (file && file.type.startsWith("image/")) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <div className={classes}>
            {layout === "column" && previewUrl && (
                <div className="file__preview">
                    <img src={previewUrl} alt="미리보기" />
                </div>
            )}

            <div className="file__control">
                <input
                    ref={inputRef}
                    id={id}
                    type="file"
                    className="file__input"
                    accept={accept}
                    disabled={disabled}
                    onChange={handleChange}
                    {...props}
                />
                <label htmlFor={id} className="file__label">
                    {label}
                </label>
                <span className="file__name">{fileName}</span>
            </div>
        </div>
    );
};