"use client";

import { Button, TextField } from "@bigtablet/design-system";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Controller } from "react-hook-form";
import { useTalentForm } from "src/features/talent/form/model/use-talent-form";
import { useFocusTrap } from "src/shared/hooks/use-focus-trap";
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
		control,
		formState: { errors },
	} = form;

	const dialogRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;
		const originalStyle = window.getComputedStyle(document.body).overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = originalStyle;
		};
	}, [open]);

	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onClose]);

	/* 포커스 트랩 — Tab/Shift+Tab이 모달 내부에서만 순환 */
	useFocusTrap(dialogRef, open);

	if (!open || typeof window === "undefined") return null;

	return createPortal(
		// biome-ignore lint/a11y/noStaticElementInteractions: backdrop overlay — ESC handled via window keydown
		<div
			role="presentation"
			className={styles.modal_overlay}
			onClick={(e) => e.target === e.currentTarget && onClose()}
		>
			<div
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby="talent_modal_title"
				className={styles.modal_content}
			>
				<h2 id="talent_modal_title">인재풀 등록</h2>

				<form onSubmit={handleSubmit} className={styles.form}>
					<Controller
						name="name"
						control={control}
						rules={{ required: "이름을 입력해주세요." }}
						render={({ field: { ref, value, onChange, onBlur } }) => (
							<TextField
								ref={ref}
								label="이름"
								value={value}
								onChangeAction={onChange}
								onBlur={onBlur}
								placeholder="이름을 입력하세요"
								disabled={isFormBusy}
								error={!!errors.name}
								helperText={errors.name?.message}
								fullWidth
							/>
						)}
					/>

					<Controller
						name="email"
						control={control}
						rules={{
							required: "이메일을 입력해주세요.",
							pattern: {
								value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
								message: "유효한 이메일 형식이 아닙니다.",
							},
						}}
						render={({ field: { ref, value, onChange, onBlur } }) => (
							<TextField
								ref={ref}
								label="이메일"
								value={value}
								onChangeAction={onChange}
								onBlur={onBlur}
								placeholder="example@bigtablet.kr"
								disabled={isFormBusy}
								error={!!errors.email}
								helperText={errors.email?.message}
								fullWidth
							/>
						)}
					/>

					<Controller
						name="department"
						control={control}
						rules={{ required: "희망 직무를 입력해주세요." }}
						render={({ field: { ref, value, onChange, onBlur } }) => (
							<TextField
								ref={ref}
								label="희망 직무"
								value={value}
								onChangeAction={onChange}
								onBlur={onBlur}
								placeholder="예: 개발팀"
								disabled={isFormBusy}
								error={!!errors.department}
								helperText={errors.department?.message}
								fullWidth
							/>
						)}
					/>

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
						<Button variant="secondary" onClick={onClose} disabled={isFormBusy}>
							취소
						</Button>
						<Button variant="primary" type="submit" disabled={isFormBusy}>
							{isPending ? "등록 중..." : "등록하기"}
						</Button>
					</div>
				</form>
			</div>
		</div>,
		document.body,
	);
};

export default TalentFormModal;
