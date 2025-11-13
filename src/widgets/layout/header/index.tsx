"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import styles from "./style.module.scss";

const SUPPORTED = ["ko", "en"] as const;
type Locale = (typeof SUPPORTED)[number];

const Header = () => {
    const locale = useLocale() as Locale;
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const switchLocale = () => {
        const nextLocale = (locale === "en" ? "ko" : "en") as "ko" | "en";
        document.cookie =
            `NEXT_LOCALE=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax` +
            (process.env.NODE_ENV === "production" ? "; Secure" : "");
        router.refresh();
    };

    return (
        <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
            <div className={styles.inner}>
                <Link href="/main">
                    <Image
                        src="/images/logo/logo.png"
                        alt="Logo"
                        width={120}
                        height={40}
                        priority
                        className={styles.logo}
                    />
                </Link>

                <nav className={styles.nav}>
                    <Link href="/about">About Us</Link>
                    <Link href="/news">News</Link>
                    <Link href="/blog">Blog</Link>
                    <Link href="/recruit">Recruit</Link>
                    <button type="button" onClick={switchLocale} className={styles.locale_switch}>
                        {locale === "en" ? "한국어" : "English"}
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;