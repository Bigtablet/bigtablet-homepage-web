"use client";

import { useParams } from "next/navigation";

export const BigtabletParams = <T extends Record<string, string>>() => {
    return useParams() as unknown as T;
};