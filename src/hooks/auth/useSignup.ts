"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Toast } from "src/libs/toast/toast";
import { useSignupMutation } from "src/queries/auth/signup.query";
import {SignupType} from "src/types/auth/signup.type";

const isStrongPassword = (pwd: string) => {
    const hasMinLen = pwd.length >= 10;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasSpecial = /[!@#$%^&*()_\-+=[\]{};:'",.<>/?\\|`~]/.test(pwd);
    return hasMinLen && hasUpper && hasLower && hasSpecial;
};

const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

const useSignup = () => {
    const router = useRouter();
    const signupMutation = useSignupMutation();

    const [value, setValue] = useState<SignupType>({
        name: "",
        email: "",
        password: "",
    });

    const setField = useCallback(
        <K extends keyof SignupType>(key: K, v: SignupType[K]) => {
            setValue(prev => ({ ...prev, [key]: v }));
        },
        []
    );

    const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
        e => {
            const { name, value: v } = e.target;
            setField(name as keyof SignupType, v as any);
        },
        [setField]
    );

    const canSubmit = useMemo(() => {
        return (
            value.name.trim().length > 1 &&
            isValidEmail(value.email) &&
            isStrongPassword(value.password)
        );
    }, [value]);

    const handleSubmit = useCallback(async () => {
        const { name, email, password } = value;

        if (!name.trim()) {
            return Toast("error", "Please enter your name.");
        }
        if (!isValidEmail(email)) {
            return Toast("error", "Please enter a valid email.");
        }
        if (!isStrongPassword(password)) {
            return Toast(
                "error",
                "Password must be at least 10 characters and include uppercase, lowercase, and a special character."
            );
        }

        try {
            await signupMutation.mutateAsync({ name, email, password });
            Toast("success", "Sign up successful. Please sign in.");
            router.replace("/admin/auth/signin");
        } catch {
            Toast("error", "Failed to sign up. Please try again.");
        }
    }, [value, signupMutation, router]);

    return {
        value,         // { name, email, password }
        setField,      // setField('email' | 'password' | 'name', value)
        onChange,      // input 공용 onChange 핸들러
        canSubmit,
        handleSubmit,
        isSubmitting: signupMutation.isPending,
    };
};

export default useSignup;