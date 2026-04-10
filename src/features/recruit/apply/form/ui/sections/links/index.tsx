"use client";

import { TextField } from "@bigtablet/design-system";
import type { ApplyFormProps } from "src/features/recruit/apply/form/ui/type";
import styles from "../../form-base.module.scss";

type Form = ApplyFormProps["form"];

interface Props {
	form: Form;
}

export const LinksSection = ({ form }: Props) => {
	const {
		register,
		formState: { errors },
	} = form;

	return (
		<div className={styles.field}>
			<span className={styles.field_label}>
				첨부 자료 <span className={styles.sub}>최대 3개</span>
			</span>
			<div className={styles.stack}>
				<TextField
					type="url"
					placeholder="https://github.com/..."
					error={!!errors.attachment1}
					supportingText={errors.attachment1?.message as string}
					{...register("attachment1")}
				/>
				<TextField
					type="url"
					placeholder="https://www.notion.so/..."
					error={!!errors.attachment2}
					supportingText={errors.attachment2?.message as string}
					{...register("attachment2")}
				/>
				<TextField
					type="url"
					placeholder="https://portfolio.site/..."
					error={!!errors.attachment3}
					supportingText={errors.attachment3?.message as string}
					{...register("attachment3")}
				/>
			</div>
			<small className={styles.help}>URL은 http(s)로 시작해야 합니다.</small>
		</div>
	);
};
