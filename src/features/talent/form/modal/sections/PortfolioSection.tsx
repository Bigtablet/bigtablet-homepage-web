"use client";

import { TextField } from "@bigtablet/design-system";
import type { UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { PostTalentFormValues } from "src/entities/talent/schema/talent.schema";
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
		control,
		watch,
		formState: { errors },
	} = form;

	const watchPortfolioUrl = watch("portfolioUrl");

	return (
		<div className={styles.portfolio}>
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
				<Controller
					name="portfolioUrl"
					control={control}
					rules={{
						required: "포트폴리오 URL을 입력하거나 파일을 업로드해주세요.",
					}}
					render={({ field: { ref, value, onChange, onBlur } }) => (
						<TextField
							ref={ref}
							value={value}
							onChangeAction={onChange}
							onBlur={onBlur}
							placeholder="https://portfolio.example.com"
							disabled={isFormBusy}
							error={!!errors.portfolioUrl}
							supportingText={errors.portfolioUrl?.message}
							fullWidth
						/>
					)}
				/>
			)}

			{portfolioMode === "file" && (
				<div className={styles.portfolio_file}>
					<FileInput
						label={isUploading ? "업로드 중..." : "파일 선택"}
						onFiles={handlePortfolioFile}
						disabled={isFormBusy}
					/>
					{watchPortfolioUrl && <p className={styles.helper}>업로드된 URL: {watchPortfolioUrl}</p>}
					{errors.portfolioUrl && (
						<p className={styles.portfolio_error}>{errors.portfolioUrl.message}</p>
					)}
				</div>
			)}
		</div>
	);
};
