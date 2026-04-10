"use client";

import Image from "next/image";
import * as React from "react";
import styles from "./style.module.scss";

/** 파일 입력 컴포넌트 Props */
export interface FileInputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
	label?: string;
	layout?: "row" | "column";
	onFiles?: (file: File | null) => void;
}

/**
 * @component FileInput
 *
 * @description
 * 파일 선택 입력 컴포넌트. 이미지 파일 선택 시 미리보기를 표시한다.
 * row/column 레이아웃을 지원한다.
 *
 * @param props.onFiles - 파일 선택 시 콜백 (File 또는 null)
 * @param props.layout - 레이아웃 방향 ("row" | "column")
 */
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

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.currentTarget.files?.[0] ?? null;

		setFileName(file?.name ?? "선택된 파일 없음");
		onFiles?.(file);

		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
			setPreviewUrl(null);
		}

		if (file?.type.startsWith("image/")) {
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
					<Image src={previewUrl} alt="미리보기" width={200} height={200} unoptimized />
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
