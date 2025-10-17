import axios from "axios";
import type { RefreshRequest, RefreshResponse } from "src/types/auth/response.type";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL!;

export const refresh = async (payload: RefreshRequest): Promise<string> => {
    const { data } = await axios.post<RefreshResponse>(`${SERVER_URL}/auth/refresh`, payload, {
        withCredentials: true,
    });
    return data.data.accessToken;
};