"use client";

import { useSearchParams } from "next/navigation";

export const BigtabletSearchParams = () => {
    const raw = useSearchParams();

    return {
        raw,

        get(key: string): string | null {
            return raw.get(key);
        },

        getString(key: string, defaultValue?: string): string | undefined {
            return raw.get(key) ?? defaultValue;
        },

        getNumber(key: string, defaultValue?: number): number | undefined {
            const v = raw.get(key);
            if (v == null) return defaultValue;
            const n = Number(v);
            return Number.isFinite(n) ? n : defaultValue;
        },

        getBoolean(key: string, defaultValue = false): boolean {
            const v = raw.get(key);
            if (v == null) return defaultValue;
            return ["true", "1", "yes", "on"].includes(v.toLowerCase());
        },

        toString() {
            return raw.toString();
        },

        entries() {
            return raw.entries();
        },
    };
}