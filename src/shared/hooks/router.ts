"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import {useNavigationStore} from "src/shared/hooks/navigation";

const DEFAULT_THROTTLE_MS = 300;

export const BigtabletRouter = () => {
    const router = useRouter();
    const { setLoading } = useNavigationStore();
    const lastCallRef = useRef(0);

    const runWithThrottle = (fn: () => void, limit = DEFAULT_THROTTLE_MS) => {
        const now = Date.now();
        if (now - lastCallRef.current < limit) return;
        lastCallRef.current = now;
        fn();
    };

    const push = (href: string, throttleMs = DEFAULT_THROTTLE_MS) => {
        runWithThrottle(() => {
            setLoading(true);
            router.push(href);
        }, throttleMs);
    };

    const replace = (href: string, throttleMs = DEFAULT_THROTTLE_MS) => {
        runWithThrottle(() => {
            setLoading(true);
            router.replace(href);
        }, throttleMs);
    };

    const back = (throttleMs = DEFAULT_THROTTLE_MS) => {
        runWithThrottle(() => {
            setLoading(true);
            router.back();
        }, throttleMs);
    };

    const refresh = (throttleMs = DEFAULT_THROTTLE_MS) => {
        runWithThrottle(() => {
            setLoading(true);
            router.refresh();
        }, throttleMs);
    };

    return { push, replace, back, refresh };
};