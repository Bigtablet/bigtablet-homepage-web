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

export const ProfileSection = ({ form, upload, isUploading }: Props) => {
    const {
        control,
        formState: { errors },
    } = form;

    return (
        <div className={styles.profile}>
            <label className={styles.profile_label}>프로필 사진*</label>
            <Controller
                control={control}
                name="profileImage"
                render={({ field }) => (
                    <FileInput
                        layout="column"
                        accept="image/png"
                        disabled={isUploading}
                        onFiles={async (file) => {
                            if (!file) {
                                field.onChange("");
                                return;
                            }
                            const url = await upload(file);
                            field.onChange(url);
                        }}
                    />
                )}
            />
            {errors.profileImage && (
                <small className={styles.error}>
                    {errors.profileImage.message as string}
                </small>
            )}
            <p className={styles.profile_help}>PNG 파일만 업로드 가능합니다.</p>
        </div>
    );
};