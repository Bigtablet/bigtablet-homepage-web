import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { applySchema } from "src/features/recruit/model/apply/schema";

export type ApplyFormValuesIn = z.input<typeof applySchema>;

export interface ApplyFormProps {
    form: UseFormReturn<ApplyFormValuesIn>;
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
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}