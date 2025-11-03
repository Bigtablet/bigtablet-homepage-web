// submit.ts
import {useCallback} from "react";
import type {FieldValues, UseFormReturn} from "react-hook-form";
import {useRouter} from "next/navigation";
import {
    ApplyEducationLevel,
    type RecruitRequest,
} from "src/entities/recruit/model/schema/recruit.schema";
import {currentYearMonth, mapMil} from "src/features/recruit/model/apply/utils";
import {useRecruitApplyMutation} from "src/features/recruit/model/query/recruit.query";
import {useGcpUpload} from "src/shared/stroage/gcp/hook/gcp.hook";
import {Toast} from "src/shared/libs/ui/toast/toast";

type Params<TFormValues extends FieldValues = FieldValues> = {
    form: UseFormReturn<TFormValues>;
    jobId: number;
    emailVerified: boolean;
    formId?: string;
};

const useApplySubmit = <TFormValues extends FieldValues = FieldValues>({
                                                                           form,
                                                                           jobId,
                                                                           emailVerified,
                                                                           formId = "apply-form",
                                                                       }: Params<TFormValues>) => {
    const router = useRouter();
    const {upload, isPending: isUploading} = useGcpUpload();
    const {mutate, isPending: isSubmitting} = useRecruitApplyMutation({
        onSuccess: () => {
            Toast.success("지원이 완료되었습니다.");
            router.push(`/recruit/${jobId}`);
        },
        onError: (e) => alert(e.message),
    });

    const uploadIfFile = useCallback(
        async (file?: File | null) => (file && file.size ? (await upload(file)) ?? "" : ""),
        [upload]
    );

    const pickFile = useCallback(
        (name: string) => {
            const root =
                (typeof document !== "undefined" &&
                    (document.getElementById(formId) as HTMLFormElement | null)) ||
                document;
            return (
                (root?.querySelector(`input[name="${name}"]`) as HTMLInputElement | null)?.files?.[0] ??
                null
            );
        },
        [formId]
    );

    const onSubmit = form.handleSubmit(async (values: any) => {
        if (!emailVerified) {
            alert("이메일 인증 후 제출해주세요.");
            return;
        }
        if (!(jobId > 0)) {
            alert("유효하지 않은 공고입니다.");
            return;
        }

        // ⚠️ 아래 매핑은 현재 폼 필드명에 맞춰 1회 정리하세요.
        const phoneNumber = values.phoneNumber ?? values.phone ?? "";
        const address = values.address ?? values.address1 ?? "";
        const addressDetail = values.addressDetail ?? values.address2 ?? "";
        const eduLevel = values.educationLevel ?? values.eduLevel;
        const schoolName = values.schoolName ?? values.eduSchool ?? "";
        const admission = values.admissionYear ?? values.eduStart ?? "";
        const graduation = values.graduationYear ?? values.graduationEnd ?? values.eduEnd ?? "";
        const department = values.department ?? values.eduMajor ?? "";
        const militaryRaw = values.military ?? "";

        const [photo, portfolio, cover, disability] = await Promise.all([
            uploadIfFile(pickFile("photo")),
            uploadIfFile(pickFile("portfolio")),
            uploadIfFile(pickFile("coverletter")),
            uploadIfFile(pickFile("disabilityFile")),
        ]);

        const links = [
            values.attachment1 ?? values.attachmentLink1 ?? "",
            values.attachment2 ?? values.attachmentLink2 ?? "",
            values.attachment3 ?? values.attachmentLink3 ?? "",
        ].filter(Boolean);

        const ordered = [disability, ...links].filter(Boolean);
        const [attachment1 = "", attachment2 = "", attachment3 = ""] = ordered;

        const isGed = eduLevel === ApplyEducationLevel.enum.GED;

        const payload: RecruitRequest = {
            jobId,
            name: values.name,
            phoneNumber,
            email: values.email,
            address,
            addressDetail,
            portfolio,
            coverLetter: cover,
            profileImage: photo,
            educationLevel: eduLevel,
            schoolName: isGed ? "" : schoolName,
            admissionYear: isGed ? currentYearMonth() : admission,
            graduationYear: isGed ? currentYearMonth() : graduation,
            department: isGed ? "" : department,
            military: mapMil(militaryRaw),
            attachment1,
            attachment2,
            attachment3,
        };

        mutate(payload);
    });

    const canSubmit = !isSubmitting && !isUploading && emailVerified;

    return {onSubmit, canSubmit, isSubmitting, isUploading};
};

export default useApplySubmit;