"use client";

import { Select } from "@bigtablet/design-system";
import { Controller } from "react-hook-form";
import type { ApplyFormProps } from "src/features/recruit/apply/form/ui/type";
import styles from "../../form-base.module.scss";

type Form = ApplyFormProps["form"];

interface Props {
	form: Form;
}

export const MilitarySection = ({ form }: Props) => {
	const {
		control,
		formState: { errors },
	} = form;

	return (
		<div className={styles.field}>
			<span className={styles.field_label}>병역 사항*</span>
			<Controller
				control={control}
				name="military"
				render={({ field }) => (
					<Select
						size="sm"
						placeholder="병역 사항 선택"
						value={field.value}
						onChange={(v) => field.onChange(v)}
						fullWidth
						options={[
							{ value: "", label: "병역 사항 선택", disabled: true },
							{ value: "COMPLETED", label: "군필" },
							{ value: "NOT_COMPLETED", label: "미필" },
							{ value: "NOT_APPLICABLE", label: "해당없음" },
						]}
					/>
				)}
			/>
			{errors.military && (
				<small className={styles.error}>
					{errors.military.message as string}
				</small>
			)}
		</div>
	);
};
