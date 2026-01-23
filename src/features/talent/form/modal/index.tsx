"use client";

import { useEffect } from "react";
import { useTalentForm } from "src/features/talent/form/model/use-talent-form";
import { PortfolioSection } from "./sections/PortfolioSection";
import { UrlListSection } from "./sections/UrlListSection";
import styles from "./style.module.scss";

interface Props {
	open: boolean;
	onClose: () => void;
}

const TalentFormModal = ({ open, onClose }: Props) => {
	const {
		form,
		fields,
		append,
		remove,
		portfolioMode,
		setPortfolioMode,
		handlePortfolioFile,
		handleSubmit,
		isFormBusy,
		isPending,
		isUploading,
	} = useTalentForm({ onClose });

	const {
		register,
		formState: { errors },
	} = form;

	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "auto";
	}, [open]);

	if (!open) return null;

	return (
		<div className={styles.modal_overlay}>
			<div className={styles.modal_content}>
				<h2>인재풀 등록</h2>

				<form onSubmit={handleSubmit} className={styles.form}>
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

					<PortfolioSection
						form={form}
						portfolioMode={portfolioMode}
						setPortfolioMode={setPortfolioMode}
						handlePortfolioFile={handlePortfolioFile}
						isFormBusy={isFormBusy}
						isUploading={isUploading}
					/>

					<UrlListSection
						form={form}
						fields={fields}
						append={append}
						remove={remove}
						isFormBusy={isFormBusy}
					/>

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
