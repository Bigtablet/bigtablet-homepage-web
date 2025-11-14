"use client";

import { TextField } from "src/shared/ui/form/textfield";
import styles from "./style.module.scss";
import {ApplyFormProps} from "src/widgets/recruit/apply/form/type";

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
                    error={!!errors.name}
                    helperText={errors.name?.message as string}
                    type="url"
                    placeholder="https://github.com/..."
                    {...register("attachment1")}
                />
                <TextField
                    size="sm"
                    error={!!errors.name}
                    helperText={errors.name?.message as string}
                    type="url"
                    placeholder="https://www.notion.so/..."
                    {...register("attachment2")}
                />
                <TextField
                    size="sm"
                    error={!!errors.name}
                    helperText={errors.name?.message as string}
                    type="url"
                    placeholder="https://portfolio.site/..."
                    {...register("attachment3")}
                />
            </div>
            <small className={styles.help}>
                URL은 http(s)로 시작해야 합니다.
            </small>

            {errors.attachment1 && (
                <small className={styles.error}>
                    {errors.attachment1.message as string}
                </small>
            )}
            {errors.attachment2 && (
                <small className={styles.error}>
                    {errors.attachment2.message as string}
                </small>
            )}
            {errors.attachment3 && (
                <small className={styles.error}>
                    {errors.attachment3.message as string}
                </small>
            )}
        </div>
    );
};