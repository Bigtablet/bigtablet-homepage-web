"use client";

import { TextField } from "src/shared/ui/form/textfield";
import styles from "./style.module.scss";
import { ApplyFormProps } from "src/widgets/recruit/apply/form/type";

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
            <label>
                첨부 자료 <span className={styles.sub}>최대 3개</span>
            </label>
            <div className={styles.stack}>
                <TextField
                    size="sm"
                    type="url"
                    placeholder="https://github.com/..."
                    error={!!errors.attachment1}
                    helperText={errors.attachment1?.message as string}
                    {...register("attachment1")}
                />
                <TextField
                    size="sm"
                    type="url"
                    placeholder="https://www.notion.so/..."
                    error={!!errors.attachment2}
                    helperText={errors.attachment2?.message as string}
                    {...register("attachment2")}
                />
                <TextField
                    size="sm"
                    type="url"
                    placeholder="https://portfolio.site/..."
                    error={!!errors.attachment3}
                    helperText={errors.attachment3?.message as string}
                    {...register("attachment3")}
                />
            </div>
            <small className={styles.help}>
                URL은 http(s)로 시작해야 합니다.
            </small>
        </div>
    );
};