import { useMutation } from "@tanstack/react-query";
import { signinApi } from "src/api/auth/signin.api";
import { QueryKey } from "../queryKey";
import { SigninType } from "src/types/auth/signin.type";

export const useSigninMutation = () => {
    return useMutation({
        mutationKey: [QueryKey.auth.signin],
        mutationFn: (payload: SigninType) => signinApi(payload),
    });
};