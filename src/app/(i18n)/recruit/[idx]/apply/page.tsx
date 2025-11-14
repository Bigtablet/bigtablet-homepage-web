"use client";

import { useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import Template from "src/widgets/layout/template";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import styles from "./style.module.scss";

import {
    applySchema,
    type ApplyFormValues,
} from "src/features/recruit/model/apply/schema/apply.schema";
import useEmailVerification from "src/features/recruit/model/apply/email/model/verification";
import ApplyForm from "src/widgets/recruit/apply/form";
import { useApplySubmit } from "src/features/recruit/model/apply/hook/apply.hook";

const ApplyPage = () => {
    const { idx } = useParams<{ locale: string; idx: string }>();
    const jobId = useMemo(() => Number(idx) || -1, [idx]);

    const form = useForm<ApplyFormValues>({
        resolver: zodResolver(applySchema) as Resolver<ApplyFormValues>,
        defaultValues: {
            jobId,
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
            military: "NOT_COMPLETED",
            attachment1: "",
            attachment2: "",
            attachment3: "",
        },
        mode: "onChange",
    });

    useEffect(() => {
        const current = form.getValues("jobId");
        if (current !== jobId) {
            form.setValue("jobId", jobId, { shouldDirty: true });
        }
    }, [jobId, form]);

    const rawEmail = useEmailVerification({
        getEmail: () => form.getValues("email"),
        cooldownSec: 60,
    });

    const email = {
        ...rawEmail,
        send: async () => {
            await rawEmail.send();
        },
        verify: async () => {
            await rawEmail.verify();
        },
    };

    const { onSubmit } = useApplySubmit({
        form,
        jobId,
        emailVerified: email.emailVerified,
    });

    return (
        <Template>
            <div className={styles.apply}>
                <h1 className={styles.apply_title}>지원서 작성</h1>
                <ApplyForm form={form} email={email} onSubmit={onSubmit} />
            </div>
        </Template>
    );
};

export default ApplyPage;