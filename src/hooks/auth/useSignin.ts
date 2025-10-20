"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Toast } from "src/libs/toast/toast";
import Token from "src/libs/token/cookie";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "src/constants/token/token.constants";
import { useSigninMutation } from "src/queries/auth/signin.query";
import type { SigninType } from "src/types/auth/signin.type";

const useSignin = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const next = searchParams.get("next") || "/admin/main";

    const signinMutation = useSigninMutation();
    const [signinData, setSigninData] = useState<SigninType>({ email: "", password: "" });

    const handleSigninData = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSigninData(prev => ({ ...prev, [name]: value }));
    }, []);

    const submitSigninData = useCallback(() => {
        if (!signinData.email?.trim()) return Toast("info", "Please enter your email.");
        if (!signinData.password?.trim()) return Toast("info", "Please enter your password.");

        signinMutation.mutate(signinData, {
            onSuccess: (res) => {
                const { accessToken, refreshToken } = res.data || {};
                if (!accessToken || !refreshToken) {
                    Toast("error", "Token missing in response.");
                    return;
                }

                Token.setToken(ACCESS_TOKEN, accessToken);
                Token.setToken(REFRESH_TOKEN, refreshToken);

                Toast("success", "Signin successful.");

                router.replace(next);
            },
            onError: () => {
                Toast("error", "Invalid email or password. Please try again.");
            },
        });
    }, [signinData, signinMutation, router, next]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            submitSigninData();
        }
    }, [submitSigninData]);

    return {
        signinData,
        handleSigninData,
        handleKeyDown,
        submitSigninData,
        isLoading: signinMutation.isPending,
    };
};

export default useSignin;