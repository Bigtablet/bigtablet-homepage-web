"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Toast } from "src/libs/toast/toast";
import { usePostJobQuery } from "src/queries/job/job.query";
import type {
    PostJobPayload,
    Department,
    Location,
    RecruitType,
    Education,
} from "src/types/job/job.type";

const DEFAULT: PostJobPayload = {
    title: "",
    department: "IT",
    location: "SEOUL",
    recruitType: "FULL_TIME",
    experiment: "",
    education: "BACHELOR",
    companyIntroduction: "",
    mainResponsibility: "",
    qualification: "",
    preferredQualification: "",
    startDate: "",
    endDate: "",
};

const DEPARTMENTS: Department[] = [
    "BUSINESS_ADMINISTRATION",
    "SALE",
    "MARKETING",
    "IT",
    "DESIGN",
    "RESEARCH_AND_DEVELOPMENT",
];

const LOCATIONS: Location[] = ["SEOUL", "DAEGU"];
const RECRUIT_TYPES: RecruitType[] = ["FULL_TIME", "CONTRACT", "INTERN"];
const EDUCATIONS: Education[] = [
    "HIGH_SCHOOL",
    "ASSOCIATE",
    "BACHELOR",
    "NO_REQUIREMENT",
];

const usePostJob = () => {
    const router = useRouter();
    const postJobQuery = usePostJobQuery();
    const [value, setValue] = useState<PostJobPayload>(DEFAULT);

    const setField = useCallback(<K extends keyof PostJobPayload>(k: K, v: PostJobPayload[K]) => {
        setValue(prev => ({ ...prev, [k]: v }));
    }, []);

    const onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> =
        useCallback((e) => {
            const { name, value } = e.target;
            setField(name as keyof PostJobPayload, value as any);
        }, [setField]);

    const canSubmit = useMemo(() => {
        return (
            value.title.trim().length > 0 &&
            value.experiment.trim().length > 0 &&
            value.companyIntroduction.trim().length > 0 &&
            value.mainResponsibility.trim().length > 0 &&
            value.qualification.trim().length > 0 &&
            value.startDate &&
            value.endDate
        );
    }, [value]);

    const submit = useCallback(async () => {
        if (!canSubmit) {
            Toast("info", "필수 항목을 모두 입력해 주세요.");
            return;
        }

        try {
            await postJobQuery.mutateAsync(value);
            Toast("success", "채용공고가 등록되었습니다.");
            router.replace("/admin/jobs");
        } catch {
            Toast("error", "등록에 실패했습니다. 다시 시도해 주세요.");
        }
    }, [canSubmit, postJobQuery, router, value]);

    return {
        value,
        setField,
        onChange,
        canSubmit,
        submit,
        isSubmitting: postJobQuery.isPending,
        enums: { DEPARTMENTS, LOCATIONS, RECRUIT_TYPES, EDUCATIONS },
    };
};

export default usePostJob;