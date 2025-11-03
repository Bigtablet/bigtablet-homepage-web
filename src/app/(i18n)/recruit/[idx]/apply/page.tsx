"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Template from "src/widgets/layout/frame";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import "./style.scss";
import { applySchema } from "src/features/recruit/model/apply/schema";


import useApplySubmit from "src/features/recruit/model/apply/email/model/submit";
import useEmailVerification from "src/features/recruit/model/apply/email/model/verification";

import ApplyForm from "src/features/recruit/model/apply/ui/form";

type ApplyFormValuesIn = z.input<typeof applySchema>;

const ApplyPage = () => {
    const { idx } = useParams<{ locale: string; idx: string }>();
    const jobId = useMemo(() => Number(idx) || -1, [idx]);

    const form = useForm<ApplyFormValuesIn>({
        resolver: zodResolver(applySchema),
        defaultValues: {
            name: "",
            phoneNumber: "010",
            email: "",
            address: "",
            addressDetail: "",
            portfolio: "",
            coverLetter: "",
            profileImage: "",
            educationLevel: "BACHELOR",
            schoolName: "",
            admissionYear: "",
            graduationEnd: "",
            department: "",
            military: "NOT_APPLICABLE",
            attachment1: "",
            attachment2: "",
            attachment3: "",
        },
        mode: "onChange",
    });

    const email = useEmailVerification({
        getEmail: () => form.getValues("email"),
        cooldownSec: 60,
    });

    const submit = useApplySubmit({
        form,
        jobId,
        emailVerified: email.emailVerified,
    });

    return (
        <Template>
            <div className="apply">
                <h1 className="apply__title">지원서 작성</h1>
                <ApplyForm form={form} email={email} onSubmit={submit.onSubmit} />
            </div>
        </Template>
    );
};

export default ApplyPage;