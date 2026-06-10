"use client";

import { Button, useAlert, useToast } from "@bigtablet/design-system";
import { ContactSection } from "src/features/recruit/apply/form/ui/sections/contact";
import { EducationSection } from "src/features/recruit/apply/form/ui/sections/education";
import { LinksSection } from "src/features/recruit/apply/form/ui/sections/links";
import { MilitarySection } from "src/features/recruit/apply/form/ui/sections/military";
import { PortfolioSection } from "src/features/recruit/apply/form/ui/sections/portfolio";
import { ProfileSection } from "src/features/recruit/apply/form/ui/sections/profile";
import { useUpload } from "src/features/upload/model/use-upload";
import { getErrorMessage } from "src/shared/libs/api/axios/error/error.util";
import styles from "./style.module.scss";
import type { ApplyFormProps } from "./type";

const ApplyForm = ({ form, email, onSubmit }: ApplyFormProps) => {
	const {
		formState: { errors, isSubmitting },
		handleSubmit,
	} = form;

	const { upload, isPending: isUploading } = useUpload();
	const { showAlert } = useAlert();
	const Toast = useToast();

	/* 업로드 실패(파일 검증/네트워크) 시 toast 표시 후 빈 문자열 반환. 핸들러는 빈 값이면 field 를 갱신하지 않아 기존 업로드 값을 보존한다. */
	const safeUpload = async (file: File): Promise<string> => {
		try {
			return await upload(file);
		} catch (e: unknown) {
			Toast.error(getErrorMessage(e, "파일 업로드에 실패했습니다."));
			return "";
		}
	};

	const handleSubmitWithConfirm = () => {
		showAlert({
			title: "제출 확인",
			message: "지원서를 제출하시겠습니까?",
			showCancel: true,
			confirmText: "제출하기",
			cancelText: "취소",
			onConfirm: () => onSubmit(),
		});
	};

	return (
		<form className={styles.apply_form} noValidate onSubmit={handleSubmit(handleSubmitWithConfirm)}>
			<div className={styles.apply_grid}>
				<div className={styles.apply_left}>
					<ContactSection form={form} email={email} />
					<PortfolioSection form={form} upload={safeUpload} isUploading={isUploading} />
					<EducationSection form={form} />
					<MilitarySection form={form} />
					<LinksSection form={form} />

					{errors.root?.message && (
						<p className={styles.form_error}>{errors.root.message as string}</p>
					)}

					<Button
						className={styles.apply_submit}
						type="submit"
						size="lg"
						disabled={isSubmitting || isUploading}
					>
						제출하기
					</Button>

					<p className={styles.apply_footer}>
						기타 채용 관련 문의사항은{" "}
						<a href="mailto:recruit@bigtablet.com">recruit@bigtablet.com</a> 으로 연락 바랍니다
					</p>
				</div>

				<div className={styles.apply_right}>
					<ProfileSection form={form} upload={safeUpload} isUploading={isUploading} />
				</div>
			</div>
		</form>
	);
};

export default ApplyForm;
