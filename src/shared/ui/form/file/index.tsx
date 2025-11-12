"use client";

import * as React from "react";
import "./style.scss";

export interface FileInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    label?: string;
    layout?: "row" | "column";
    onFiles?: (file: File | null) => void; // 단일 파일
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
    const inputRef = React.useRef<HTMLInputElement>(null);

    const classes = ["file", `file--${layout}`, className].filter(Boolean).join(" ");

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.currentTarget.files?.[0] ?? null;
        setFileName(file?.name ?? "선택된 파일 없음");
        onFiles?.(file);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <div className={classes}>
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
            <label htmlFor={id} className="file__label">{label}</label>
            <span className="file__name">{fileName}</span>
        </div>
    );
};