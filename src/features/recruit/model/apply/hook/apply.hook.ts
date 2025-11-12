"use client";

import type { UseFormReturn, FieldErrors } from "react-hook-form";
import { useRecruitApplyMutation } from "src/features/recruit/model/query/recruit.query";
import type { ApplyFormValues } from "src/features/recruit/model/apply/schema/apply.schema";
import { useToast } from "src/shared/ui/feedback/toast/useToast";
import {useRouter} from "next/navigation";

type Params = {
    form: UseFormReturn<ApplyFormValues>;
    jobId: number;
    emailVerified: boolean;
};

export const useApplySubmit = ({ form, jobId, emailVerified }: Params) => {
    const Toast = useToast();
    const mutation = useRecruitApplyMutation(); // 콜백 옵션 전달 X
    const router = useRouter();

    const onValid = async (v: ApplyFormValues) => {
        if (!emailVerified) {
            Toast.warning("이메일 인증을 완료해주세요.");
            return;
        }
        if (v.educationLevel === "GED") {
            v.schoolName = "";
            v.graduationEnd = "";
            v.department = "";
        }

        try {
            await mutation.mutateAsync({ ...v, jobId });
            Toast.success("지원이 완료되었습니다.");
            router.push("/recruit");
        } catch (err) {
            Toast.error("지원 중 문제가 발생했습니다.");
        }
    };

    const onInvalid = (errors: FieldErrors<ApplyFormValues>) => {
        const first = Object.values(errors)[0] as { message?: string } | undefined;
        Toast.error(first?.message || "입력값을 확인해주세요.");
    };

    return {
        onSubmit: form.handleSubmit(onValid, onInvalid),
        isSubmitting: mutation.isPending,
    };
};