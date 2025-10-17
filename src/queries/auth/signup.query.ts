import { useMutation } from "@tanstack/react-query";
import {signupApi} from "src/api/auth/signup.api";
import { QueryKey } from "../queryKey";

export const useSignupMutation = () => {
    return useMutation({
        mutationKey: [QueryKey.auth.signup],
        mutationFn: signupApi,
    });
};