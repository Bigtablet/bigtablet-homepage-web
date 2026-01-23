"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import type {
	PostTalent,
	PostTalentFormValues,
} from "src/entities/talent/model/schema/talent.schema";
import { useTalentMutation } from "src/features/talent/mutation/talent.mutation";
import { useUploadMutation } from "src/features/upload/mutation/upload.mutation";
import { useToast } from "@bigtablet/design-system";

type PortfolioMode = "link" | "file";

const ensureHttps = (url: string) => {
	if (!url) return "";
	if (url.startsWith("http://") || url.startsWith("https://")) return url;
	return `https://${url}`;
};

interface UseTalentFormParams {
	onClose: () => void;
}

export const useTalentForm = ({ onClose }: UseTalentFormParams) => {
	const Toast = useToast();
	const { mutateAsync: createTalent, isPending } = useTalentMutation();
	const { mutateAsync: uploadFile, isPending: isUploading } =
		useUploadMutation();

	const [portfolioMode, setPortfolioMode] = useState<PortfolioMode>("link");

	const form = useForm<PostTalentFormValues>({
		defaultValues: {
			email: "",
			name: "",
			department: "",
			portfolioUrl: "",
			etcUrl: [""],
		},
		mode: "onBlur",
		shouldUnregister: false,
	});

	const { fields, append, remove } = useFieldArray<any>({
		control: form.control as any,
		name: "etcUrl",
	});

	const handlePortfolioFile = async (file: File | null) => {
		if (!file) return;
		try {
			const res = await uploadFile(file);
			const url = res.data ?? "";
			form.setValue("portfolioUrl", url, { shouldValidate: true });
			form.clearErrors("portfolioUrl");
		} catch (err) {
			Toast.error("파일 업로드에 실패했습니다. 다시 시도해주세요.");
			form.setValue("portfolioUrl", "", { shouldValidate: true });
		}
	};

	const handleSubmit = async (values: PostTalentFormValues) => {
		const filtered = values.etcUrl
			.filter((v) => v.trim() !== "")
			.map((u) => ensureHttps(u));

		const payload: PostTalent = {
			email: values.email,
			name: values.name,
			department: values.department,
			portfolioUrl: ensureHttps(values.portfolioUrl),
			...(filtered.length > 0 ? { etcUrl: filtered } : {}),
		};

		try {
			await createTalent(payload);
			Toast.success("등록이 완료되었습니다.");
			form.reset();
			setPortfolioMode("link");
			onClose();
		} catch (error: any) {
			const message =
				error?.response?.data?.message ||
				error?.message ||
				"등록 중 오류가 발생했습니다.";
			Toast.error(message);
		}
	};

	const handleModeChange = (mode: PortfolioMode) => {
		setPortfolioMode(mode);
		if (mode === "file") {
			form.setValue("portfolioUrl", "", { shouldValidate: false });
		}
	};

	return {
		form,
		fields,
		append,
		remove,
		portfolioMode,
		setPortfolioMode: handleModeChange,
		handlePortfolioFile,
		handleSubmit: form.handleSubmit(handleSubmit),
		isFormBusy: isPending || isUploading,
		isPending,
		isUploading,
	};
};
