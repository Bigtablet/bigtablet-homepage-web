"use client";

import type { UseFormReturn } from "react-hook-form";
import type { PostTalentFormValues } from "src/entities/talent/model/schema/talent.schema";
import styles from "../style.module.scss";

interface UrlListSectionProps {
	form: UseFormReturn<PostTalentFormValues>;
	fields: { id: string }[];
	append: (value: string) => void;
	remove: (index: number) => void;
	isFormBusy: boolean;
}

export const UrlListSection = ({
	form,
	fields,
	append,
	remove,
	isFormBusy,
}: UrlListSectionProps) => {
	const {
		register,
		formState: { errors },
	} = form;

	return (
		<div className={styles.urls}>
			<span>기타 URL</span>

			{fields.map((field, index) => (
				<div key={field.id} className={styles.url_row}>
					<input
						{...register(`etcUrl.${index}`)}
						placeholder="예: github.com/user"
						disabled={isFormBusy}
					/>

					{index > 0 && (
						<button
							type="button"
							className={styles.url_remove}
							onClick={() => remove(index)}
							disabled={isFormBusy}
						>
							삭제
						</button>
					)}

					{errors.etcUrl?.[index] && (
						<p className={styles.error}>{errors.etcUrl[index]?.message}</p>
					)}
				</div>
			))}

			<button
				type="button"
				className={styles.url_add}
				onClick={() => append("")}
				disabled={isFormBusy}
			>
				+ URL 추가
			</button>
		</div>
	);
};
