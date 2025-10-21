import BigtabletAxios from "src/libs/axios";
import { SigninType } from "src/types/auth/signin.type";
import { NewAccessTokenResponse } from "src/types/auth/response.type";

export const signinApi = async (signin: SigninType): Promise<NewAccessTokenResponse> => {
    const { data } = await BigtabletAxios.post<NewAccessTokenResponse>(`/auth/sign-in`, signin);
    return data;
};