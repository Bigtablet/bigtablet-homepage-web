import {AxiosResponse} from "axios";

export interface NewAccessTokenResponse extends AxiosResponse {
    data: {
        accessToken: string;
        refreshToken: string;
    }
}

export interface RefreshRequest {
    refreshToken: string;
}

export interface RefreshResponse {
    data: {
        accessToken: string;
    }
}