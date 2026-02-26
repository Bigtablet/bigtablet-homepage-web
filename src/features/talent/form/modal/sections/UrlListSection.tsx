"use client";

import { Button, TextField } from "@bigtablet/design-system";
import type { UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { PostTalentFormValues } from "src/entities/talent/schema/talent.schema";
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
		control,
		formState: { errors },
	} = form;

	return (
		<div className={styles.urls}>
			<span>기타 URL</span>

			{fields.map((field, index) => (
				<div key={field.id} className={styles.url_row}>
					<Controller
						name={`etcUrl.${index}`}
						control={control}
						render={({ field: { ref, value, onChange, onBlur } }) => (
							<TextField
								ref={ref}
								value={value}
								onChangeAction={onChange}
								onBlur={onBlur}
								placeholder="예: github.com/user"
								disabled={isFormBusy}
								error={!!errors.etcUrl?.[index]}
								helperText={errors.etcUrl?.[index]?.message}
								fullWidth
							/>
						)}
					/>

					{index > 0 && (
						<Button
							variant="danger"
							size="sm"
							onClick={() => remove(index)}
							disabled={isFormBusy}
						>
							삭제
						</Button>
					)}
				</div>
			))}

			<Button
				variant="secondary"
				size="sm"
				onClick={() => append("")}
				disabled={isFormBusy}
			>
				+ URL 추가
			</Button>
		</div>
	);
};
