"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SUPPORTED = ["ko", "en"] as const;
type Locale = (typeof SUPPORTED)[number];

export default function Header() {
    const pathname = usePathname();
    const locale = (SUPPORTED.includes(pathname.split("/")[1] as Locale)
        ? (pathname.split("/")[1] as Locale)
        : "ko");

    const base = `/${locale}`;

    return (
        <nav className="flex gap-4 p-4">
            <Link href={`${base}`}>Home</Link>
            <Link href={`${base}/about`}>About</Link>
            <Link href={`${base}/news`}>News</Link>
        </nav>
    );
}