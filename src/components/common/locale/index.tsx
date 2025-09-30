"use client";
import { usePathname, useRouter } from "next/navigation";

export default function LocaleSwitch() {
    const pathname = usePathname();
    const router = useRouter();
    const parts = pathname.split("/");
    const current = parts[1] === "en" ? "en" : "ko";
    const target = current === "en" ? "ko" : "en";
    parts[1] = target;
    const to = parts.join("/") || `/${target}`;

    return (
        <button
            className="px-3 py-1 border rounded"
            onClick={() => router.replace(to)}
        >
            {current === "en" ? "한국어" : "English"}
        </button>
    );
}