"use client";

import { Controller } from "react-hook-form";
import { formatPhone010 } from "src/features/recruit/apply/form/model/util/apply.util";
import styles from "./style.module.scss";
import { ApplyFormProps } from "src/features/recruit/apply/form/ui/type";
import {TextField, Button} from "@bigtablet/design-system";

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
            {/* 이름 */}
            <div className={styles.field}>
                <label>이름*</label>
                <TextField
                    size="sm"
                    placeholder="홍길동"
                    error={!!errors.name}
                    helperText={errors.name?.message as string}
                    {...register("name")}
                />
            </div>

            {/* 전화번호 */}
            <div className={styles.field}>
                <label>전화번호*</label>
                <Controller
                    control={control}
                    name="phoneNumber"
                    render={({ field }) => (
                        <TextField
                            size="sm"
                            placeholder="010-1234-5678"
                            inputMode="numeric"
                            maxLength={13}
                            onChangeAction={(value) =>
                                field.onChange(formatPhone010(value as string))
                            }
                            value={field.value ?? ""}
                            error={!!errors.phoneNumber}
                            helperText={errors.phoneNumber?.message as string}
                        />
                    )}
                />
            </div>

            {/* 이메일 + 인증 */}
            <div className={styles.field}>
                <label>이메일*</label>
                <div className={`${styles.row} ${styles.row_email}`}>
                    <TextField
                        size="sm"
                        type="email"
                        placeholder="example@email.com"
                        error={!!errors.email}
                        helperText={errors.email?.message as string}
                        {...register("email")}
                    />
                    <TextField
                        size="sm"
                        placeholder="인증코드"
                        value={email.authCode}
                        onChangeAction={(value) => email.setAuthCode(value as string)}
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

            {/* 주소 */}
            <div className={styles.field}>
                <label>거주지*</label>
                <TextField
                    size="sm"
                    placeholder="서울특별시 중구 세종대로 110"
                    error={!!errors.address}
                    helperText={errors.address?.message as string}
                    {...register("address")}
                />
                <TextField
                    size="sm"
                    placeholder="상세주소"
                    {...register("addressDetail")}
                />
            </div>
        </>
    );
};