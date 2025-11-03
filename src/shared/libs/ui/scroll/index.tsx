"use client";

import { useCallback, useRef } from "react";
import {ScrollOption} from "./type";

export const useScroll = (options: ScrollOption) => {
    const observerRef = useRef<IntersectionObserver | null>(null);

    const observe = useCallback(
        (node: Element | null) => {
            if (!node) return;

            if (observerRef.current) observerRef.current.disconnect();

            observerRef.current = new IntersectionObserver((entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    options.onIntersect();
                }
            }, options);

            observerRef.current.observe(node);
        },
        [options]
    );

    return observe;
};