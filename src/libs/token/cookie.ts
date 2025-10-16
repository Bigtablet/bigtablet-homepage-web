import Cookies from "js-cookie";
import {ACCESS_TOKEN, REFRESH_TOKEN} from "src/constants/token/token.constants";

const Token = {
    getToken: (key: string): string | undefined => Cookies.get(key),

    setToken: (key: string, token: string): void => {
        Cookies.set(key, token, {});
    },

    clearToken: (): void => {
        Cookies.remove(ACCESS_TOKEN);
        Cookies.remove(REFRESH_TOKEN);
    },
};

export default Token;