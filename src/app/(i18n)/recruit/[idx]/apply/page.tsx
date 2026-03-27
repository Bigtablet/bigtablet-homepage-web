"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { type Resolver, useForm } from "react-hook-form";
import useEmailVerification from "src/features/recruit/apply/form/email/use-email-verification";

import {
	type ApplyFormValues,
	applySchema,
} from "src/features/recruit/apply/form/model/apply.schema";
import { useApplySubmit } from "src/features/recruit/apply/form/model/use-apply-submit";
import ApplyForm from "src/features/recruit/apply/form/ui";
import styles from "./style.module.scss";

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
		email: form.watch("email"),
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
		<div className={styles.apply}>
			<h1 className={styles.apply_title}>지원서 작성</h1>
			<ApplyForm form={form} email={email} onSubmit={onSubmit} />
		</div>
	);
};

export default ApplyPage;
