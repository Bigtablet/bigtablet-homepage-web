"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import "./style.scss";

const SUPPORTED = ["ko", "en"] as const;
type Locale = (typeof SUPPORTED)[number];

const Header = () => {
    const pathname = usePathname() || "/";
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            const next = window.scrollY > 10;
            setScrolled((prev) => (prev !== next ? next : prev));
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const locale: Locale = useMemo(() => {
        const seg = pathname.split("/")[1] as Locale;
        return SUPPORTED.includes(seg) ? seg : "ko";
    }, [pathname]);

    // locale 스위치 시 경로 계산
    const switchedPath = useMemo(() => {
        const parts = pathname.split("/");
        const nextLocale: Locale = locale === "en" ? "ko" : "en";
        if (SUPPORTED.includes(parts[1] as Locale)) {
            parts[1] = nextLocale;
            return parts.join("/") || `/${nextLocale}`;
        }
        return `/${nextLocale}${pathname === "/" ? "" : pathname}`;
    }, [pathname, locale]);

    const switchLocale = () => {
        const nextLocale: Locale = locale === "en" ? "ko" : "en";
        document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
        router.push(switchedPath);
    };

    const base = `/${locale}`;

    return (
        <header className={scrolled ? "scrolled" : ""}>
            <div className="inner">
                <Link href={base}>
                    <Image src="/images/logo/logo.png" alt="Logo" width={120} height={40} priority />
                </Link>

                <nav>
                    <Link href={`${base}/about`}>About Us</Link>
                    <Link href={`${base}/news`}>News</Link>
                    <Link href={`${base}/blog`}>Blog</Link>
                    <Link href={`${base}/recruit`}>Recruit</Link>
                    <button type="button" onClick={switchLocale} className="locale-switch">
                        {locale === "en" ? "한국어" : "English"}
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;