import BigtabletAxios from "src/shared/libs/api/axios";

// 이메일 인증 요청
export const sendEmailApi = async (email: string) => {
    const { data } = await BigtabletAxios.post("/auth/email", { email });
    return data;
};

// 이메일 인증 코드 확인
export const checkEmailApi = async (email: string, authCode: string) => {
    const { data } = await BigtabletAxios.post("/auth/email/check", { email, authCode });
    return data;
};