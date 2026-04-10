"use client";

import { useToast } from "@bigtablet/design-system";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import type { PostTalent, PostTalentFormValues } from "src/entities/talent/schema/talent.schema";
import { useTalentMutation } from "src/features/talent/mutation/talent.mutation";
import { useUploadMutation } from "src/features/upload/mutation/upload.mutation";
import { getErrorMessage } from "src/shared/libs/api/axios/error/error.util";
import { validateFile } from "src/shared/libs/file/validate";

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
	const { mutateAsync: uploadFile, isPending: isUploading } = useUploadMutation();

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

	// useFieldArray는 원시 배열(string[])을 직접 지원하지 않아 타입 단언 필요
	const { fields, append, remove } = useFieldArray({
		control: form.control as never,
		name: "etcUrl" as never,
	});

	const handlePortfolioFile = async (file: File | null) => {
		if (!file) return;

		const validation = validateFile(file);
		if (!validation.valid) {
			Toast.error(validation.error ?? "파일 검증에 실패했습니다.");
			return;
		}

		try {
			const response = await uploadFile(file);
			const url = response.data ?? "";
			form.setValue("portfolioUrl", url, { shouldValidate: true });
			form.clearErrors("portfolioUrl");
		} catch (_error) {
			Toast.error("파일 업로드에 실패했습니다. 다시 시도해주세요.");
			form.setValue("portfolioUrl", "", { shouldValidate: true });
		}
	};

	const handleSubmit = async (values: PostTalentFormValues) => {
		const filtered = values.etcUrl
			.filter((url) => url.trim() !== "")
			.map((url) => ensureHttps(url));

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
		} catch (error: unknown) {
			Toast.error(getErrorMessage(error, "등록 중 오류가 발생했습니다."));
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
