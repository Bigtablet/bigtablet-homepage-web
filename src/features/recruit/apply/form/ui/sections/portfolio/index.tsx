"use client";

import { Controller } from "react-hook-form";
import { FileInput } from "src/shared/ui/form/file";
import styles from "../../form-base.module.scss";
import {ApplyFormProps} from "src/features/recruit/apply/form/ui/type";

type Form = ApplyFormProps["form"];

interface Props {
    form: Form;
    upload: (file: File) => Promise<string>;
    isUploading: boolean;
}

export const PortfolioSection = ({ form, upload, isUploading }: Props) => {
    const {
        control,
        formState: { errors },
    } = form;

    return (
        <>
            <div className={styles.field}>
                <label>
                    포트폴리오 / 이력서* <span className={styles.sub}>PDF만 가능</span>
                </label>
                <Controller
                    control={control}
                    name="portfolio"
                    render={({ field }) => (
                        <FileInput
                            layout="row"
                            accept="application/pdf"
                            disabled={isUploading}
                            onFiles={async (file) => {
                                if (!file) return field.onChange("");
                                const url = await upload(file);
                                field.onChange(url);
                            }}
                        />
                    )}
                />
                {errors.portfolio && (
                    <small className={styles.error}>
                        {errors.portfolio.message as string}
                    </small>
                )}
            </div>

            <div className={styles.field}>
                <label>
                    자기소개서 <span className={styles.sub}>PDF만 가능</span>
                </label>
                <Controller
                    control={control}
                    name="coverLetter"
                    render={({ field }) => (
                        <FileInput
                            layout="row"
                            accept="application/pdf"
                            disabled={isUploading}
                            onFiles={async (file) => {
                                if (!file) return field.onChange("");
                                const url = await upload(file);
                                field.onChange(url);
                            }}
                        />
                    )}
                />
            </div>
        </>
    );
};