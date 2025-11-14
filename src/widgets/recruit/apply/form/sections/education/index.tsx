"use client";

import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { ApplyEducationLevel } from "src/entities/recruit/model/schema/recruit.schema";
import { TextField } from "src/shared/ui/form/textfield";
import { Select } from "src/shared/ui/general/select";
import MonthPickerField from "src/shared/ui/form/date";
import styles from "./style.module.scss";
import { ApplyFormProps } from "src/widgets/recruit/apply/form/type";

type Form = ApplyFormProps["form"];

interface Props {
    form: Form;
}

export const EducationSection = ({ form }: Props) => {
    const {
        control,
        register,
        watch,
        setValue,
        formState: { errors },
    } = form;

    const educationLevel = watch("educationLevel");
    const isGed = educationLevel === ApplyEducationLevel.enum.GED;

    useEffect(() => {
        if (isGed) {
            setValue("schoolName", "");
            setValue("graduationEnd", "");
            setValue("department", "");
        }
    }, [isGed, setValue]);

    return (
        <div className={styles.field}>
            <label>최종 학력*</label>

            <div
                className={[
                    styles.row,
                    styles.row_edu,
                    isGed ? styles.is_ged : "",
                ].join(" ")}
            >
                <Controller
                    control={control}
                    name="educationLevel"
                    render={({ field }) => (
                        <Select
                            size="sm"
                            placeholder="최종 학력 선택"
                            value={field.value}
                            onChange={(v) => field.onChange(v)}
                            fullWidth
                            options={[
                                { value: "GED", label: "검정고시" },
                                { value: "HIGH_SCHOOL", label: "고등학교 졸업" },
                                { value: "ASSOCIATE", label: "전문대학 졸업" },
                                { value: "BACHELOR", label: "대학교 (4년제) 졸업" },
                            ]}
                        />
                    )}
                />

                {!isGed && (
                    <TextField
                        size="sm"
                        placeholder="학교명"
                        error={!!errors.schoolName}
                        helperText={errors.schoolName?.message as string}
                        {...register("schoolName")}
                    />
                )}
            </div>

            {errors.educationLevel && (
                <small className={styles.error}>
                    {errors.educationLevel.message as string}
                </small>
            )}

            {isGed ? (
                <div className={`${styles.row} ${styles.row_ged}`}>
                    <Controller
                        control={control}
                        name="admissionYear"
                        render={({ field }) => (
                            <MonthPickerField
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="합격연도 (YYYY.MM)"
                            />
                        )}
                    />
                    {errors.admissionYear && (
                        <small className={styles.error}>
                            {errors.admissionYear.message as string}
                        </small>
                    )}
                </div>
            ) : (
                <>
                    <div className={`${styles.row} ${styles.row_edu_dates}`}>
                        <Controller
                            control={control}
                            name="admissionYear"
                            render={({ field }) => (
                                <MonthPickerField
                                    label="입학년도"
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="입학년도"
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="graduationEnd"
                            render={({ field }) => (
                                <MonthPickerField
                                    label="졸업년도"
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="졸업년도"
                                />
                            )}
                        />
                    </div>

                    {(errors.admissionYear || errors.graduationEnd) && (
                        <small className={styles.error}>
                            {(errors.admissionYear?.message ||
                                errors.graduationEnd?.message) as string}
                        </small>
                    )}

                    <TextField
                        size="sm"
                        placeholder="계열 (학과)"
                        error={!!errors.department}
                        helperText={errors.department?.message as string}
                        {...register("department")}
                    />
                </>
            )}
        </div>
    );
};