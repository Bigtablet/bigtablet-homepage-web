"use client";

import type { BaseSyntheticEvent } from "react";
import type { UseFormReturn } from "react-hook-form";
import { type ApplyFormValues } from "src/features/recruit/apply/form/model/schema/apply.schema";

export interface ApplyFormProps {
    form: UseFormReturn<ApplyFormValues>;
    email: {
        authCode: string;
        setAuthCode: (v: string) => void;
        resendSec: number;
        sendLoading: boolean;
        checkLoading: boolean;
        emailSent: boolean;
        emailVerified: boolean;
        send: () => Promise<void>;
        verify: () => Promise<void>;
    };
    onSubmit: (e?: BaseSyntheticEvent) => void;
}