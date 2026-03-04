"use client";

import { useState, useEffect } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * @description
 * 사용자의 `prefers-reduced-motion` 미디어 쿼리 감지 훅.
 * reduced motion 활성화 시 true를 반환한다.
 * SSR 안전: 서버에서는 false를 기본값으로 사용한다.
 */
export const useReducedMotion = (): boolean => {
    const [prefersReduced, setPrefersReduced] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia(QUERY);
        setPrefersReduced(mql.matches);

        const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, []);

    return prefersReduced;
};
