"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import "./style.scss";

const SUPPORTED = ["ko", "en"] as const;
type Locale = (typeof SUPPORTED)[number];

const Header = () => {
    const pathname = usePathname() || "/";
    const locale = useLocale() as Locale;
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const switchLocale = () => {
        const nextLocale = (locale === 'en' ? 'ko' : 'en') as 'ko' | 'en';
        document.cookie =
            `NEXT_LOCALE=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax` +
            (process.env.NODE_ENV === 'production' ? '; Secure' : '');
        window.location.reload();
    };

    return (
        <header className={scrolled ? "scrolled header" : "header"}>
            <div className="inner">
                <Link href="/main">
                    <Image src="/images/logo/logo.png" alt="Logo" width={120} height={40} priority />
                </Link>

                <nav>
                    <Link href="/about">About Us</Link>
                    <Link href="/news">News</Link>
                    <Link href="/blog">Blog</Link>
                    <Link href="/recruit">Recruit</Link>
                    <button type="button" onClick={switchLocale} className="locale-switch">
                        {locale === "en" ? "한국어" : "English"}
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;