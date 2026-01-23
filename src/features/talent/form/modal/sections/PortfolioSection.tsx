"use client";

import type { UseFormReturn, FieldArrayWithId } from "react-hook-form";
import type { PostTalentFormValues } from "src/entities/talent/model/schema/talent.schema";
import { FileInput } from "src/shared/ui/form/file";
import styles from "../style.module.scss";

type PortfolioMode = "link" | "file";

interface PortfolioSectionProps {
	form: UseFormReturn<PostTalentFormValues>;
	portfolioMode: PortfolioMode;
	setPortfolioMode: (mode: PortfolioMode) => void;
	handlePortfolioFile: (file: File | null) => Promise<void>;
	isFormBusy: boolean;
	isUploading: boolean;
}

export const PortfolioSection = ({
	form,
	portfolioMode,
	setPortfolioMode,
	handlePortfolioFile,
	isFormBusy,
	isUploading,
}: PortfolioSectionProps) => {
	const {
		register,
		watch,
		formState: { errors },
	} = form;

	const watchPortfolioUrl = watch("portfolioUrl");

	return (
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
						onClick={() => setPortfolioMode("file")}
						disabled={isFormBusy}
					>
						파일 업로드
					</button>
				</div>
			</div>

			{portfolioMode === "link" && (
				<input
					{...register("portfolioUrl", {
						required: "포트폴리오 URL을 입력하거나 파일을 업로드해주세요.",
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
					/>
					{watchPortfolioUrl && (
						<p className={styles.helper}>업로드된 URL: {watchPortfolioUrl}</p>
					)}
				</div>
			)}

			{errors.portfolioUrl && (
				<p className={styles.error}>{errors.portfolioUrl.message}</p>
			)}
		</label>
	);
};
