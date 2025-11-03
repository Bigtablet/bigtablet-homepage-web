"use client";

import { useRef, useState, useEffect } from "react";
import {UploadProps} from "./type";
import "./style.scss";

const UploadInput = ({ name, accept, required, imagePreview }: UploadProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [fileName, setFileName] = useState("");
    const [preview, setPreview] = useState<string>("");

    useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

    return (
        <div className="file">
            <input
                ref={inputRef}
                id={name}
                name={name}
                type="file"
                accept={accept}
                required={required}
                className="visually-hidden"
                onChange={(e) => {
                    const f = e.target.files?.[0];
                    setFileName(f?.name ?? "");
                    if (imagePreview) {
                        if (!f) { if (preview) URL.revokeObjectURL(preview); setPreview(""); return; }
                        const url = URL.createObjectURL(f);
                        if (preview) URL.revokeObjectURL(preview);
                        setPreview(url);
                    }
                }}
            />
            <label htmlFor={name} className="file__trigger">파일 선택</label>
            <span className="file__name">{fileName || "선택된 파일 없음"}</span>

            {imagePreview && preview && (
                <div className="photo">
                    <div className="photo__box">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={preview} alt="미리보기" className="photo__img" />
                    </div>
                    <button
                        type="button"
                        className="btn ghost"
                        onClick={() => {
                            if (preview) URL.revokeObjectURL(preview);
                            setPreview("");
                            setFileName("");
                            const input = inputRef.current;
                            if (input) input.value = "";
                        }}
                    >
                        제거
                    </button>
                </div>
            )}
        </div>
    );
}

export default UploadInput;