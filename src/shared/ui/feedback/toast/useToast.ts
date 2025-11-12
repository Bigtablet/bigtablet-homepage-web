"use client"

import {toast} from "react-toastify";

export const useToast = () => {
    return {
        success: (msg: string) => toast.success(msg),
        error: (msg: string) => toast.error(msg),
        warning: (msg: string) => toast.warning(msg),
        info: (msg: string) => toast.info(msg),
        message: (msg: string) => toast(msg)
    };
};