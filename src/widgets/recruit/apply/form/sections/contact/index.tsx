"use client";

import { Controller } from "react-hook-form";
import { formatPhone010 } from "src/features/recruit/model/apply/util/apply.util";
import { TextField } from "src/shared/ui/form/textfield";
import { Button } from "src/shared/ui/general/button";
import styles from "./style.module.scss";
import {ApplyFormProps} from "src/widgets/recruit/apply/form/type";

type Form = ApplyFormProps["form"];
type EmailCtx = ApplyFormProps["email"];

interface Props {
    form: Form;
    email: EmailCtx;
}

export const ContactSection = ({ form, email }: Props) => {
    const {
        register,
        control,
        formState: { errors },
    } = form;

    return (
        <>
            <div className={styles.field}>
                <label>이름*</label>
                <TextField
                    size="sm"
                    error={!!errors.name}
                    helperText={errors.name?.message as string}
                    placeholder="홍길동"
                    {...register("name")}
                />
                {errors.name && (
                    <small className={styles.error}>
                        {errors.name.message as string}
                    </small>
                )}
            </div>

            <div className={styles.field}>
                <label>전화번호*</label>
                <Controller
                    control={control}
                    name="phoneNumber"
                    render={({ field }) => (
                        <TextField
                            size="sm"
                            error={!!errors.name}
                            helperText={errors.name?.message as string}
                            placeholder="010-1234-5678"
                            inputMode="numeric"
                            maxLength={13}
                            onChangeAction={(e) =>
                                field.onChange(formatPhone010(e.target.value))
                            }
                            value={field.value ?? ""}
                        />
                    )}
                />
                {errors.phoneNumber && (
                    <small className={styles.error}>
                        {errors.phoneNumber.message as string}
                    </small>
                )}
            </div>

            <div className={styles.field}>
                <label>이메일*</label>
                <div className={`${styles.row} ${styles.row_email}`}>
                    <TextField
                        error={!!errors.name}
                        helperText={errors.name?.message as string}
                        size="sm"
                        type="email"
                        placeholder="example@email.com"
                        {...register("email")}
                    />
                    <TextField
                        error={!!errors.name}
                        helperText={errors.name?.message as string}
                        size="sm"
                        placeholder="인증코드"
                        value={email.authCode}
                        onChangeAction={(e) => email.setAuthCode(e.target.value)}
                    />
                    <Button
                        variant="secondary"
                        onClick={email.send}
                        disabled={email.sendLoading || email.resendSec > 0}
                        size="sm"
                        type="button"
                    >
                        {email.sendLoading
                            ? "전송 중..."
                            : email.resendSec > 0
                                ? `재전송 ${email.resendSec}s`
                                : "전송"}
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={email.verify}
                        disabled={email.checkLoading}
                        size="sm"
                        type="button"
                    >
                        {email.checkLoading ? "확인 중..." : "확인"}
                    </Button>
                </div>
                {errors.email && (
                    <small className={styles.error}>
                        {errors.email.message as string}
                    </small>
                )}
                <small className={styles.help} aria-live="polite">
                    {email.emailVerified
                        ? "이메일 인증이 완료되었습니다."
                        : email.emailSent
                            ? email.resendSec > 0
                                ? `인증 코드를 입력 후 확인을 눌러주세요. (재전송 ${email.resendSec}s)`
                                : "인증 코드를 입력 후 확인을 눌러주세요."
                            : "이메일 인증 부탁드립니다"}
                </small>
            </div>

            <div className={styles.field}>
                <label>거주지*</label>
                <TextField
                    size="sm"
                    error={!!errors.name}
                    helperText={errors.name?.message as string}
                    placeholder="서울특별시 중구 세종대로 110"
                    {...register("address")}
                />
                {errors.address && (
                    <small className={styles.error}>
                        {errors.address.message as string}
                    </small>
                )}
                <TextField
                    size="sm"
                    error={!!errors.name}
                    helperText={errors.name?.message as string}
                    placeholder="상세주소 (없으면 비워두셔도 됩니다)"
                    {...register("addressDetail")}
                />
            </div>
        </>
    );
};