"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import styles from "./style.module.scss";

const SUPPORTED = ["ko", "en"] as const;
type Locale = (typeof SUPPORTED)[number];

const Header = () => {
	const locale = useLocale() as Locale;
	const router = useRouter();
	const _pathname = usePathname();
	const [scrolled, setScrolled] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 10);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	useEffect(() => {
		setMenuOpen(false);
	}, []);

	useEffect(() => {
		if (menuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [menuOpen]);

	const switchLocale = useCallback(() => {
		const nextLocale = (locale === "en" ? "ko" : "en") as "ko" | "en";
		document.cookie =
			`NEXT_LOCALE=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax` +
			(process.env.NODE_ENV === "production" ? "; Secure" : "");
		router.refresh();
	}, [locale, router]);

	const toggleMenu = useCallback(() => {
		setMenuOpen((prev) => !prev);
	}, []);

	const closeMenu = useCallback(() => {
		setMenuOpen(false);
	}, []);

	return (
		<header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
			<div className={styles.inner}>
				<Link href="/main" onClick={closeMenu}>
					<Image
						src="/images/logo/logo.png"
						alt="Logo"
						width={120}
						height={40}
						priority
						className={styles.logo}
					/>
				</Link>

				<button
					type="button"
					className={styles.menu_toggle}
					onClick={toggleMenu}
					aria-label={menuOpen ? "Close menu" : "Open menu"}
					aria-expanded={menuOpen}
				>
					{menuOpen ? <X size={24} /> : <Menu size={24} />}
				</button>

				<nav className={`${styles.nav} ${menuOpen ? styles.nav_open : ""}`}>
					<Link href="/about" onClick={closeMenu}>
						About Us
					</Link>
					<Link href="/news" onClick={closeMenu}>
						News
					</Link>
					<Link href="/blog" onClick={closeMenu}>
						Blog
					</Link>
					<Link href="/recruit" onClick={closeMenu}>
						Recruit
					</Link>
					<button
						type="button"
						onClick={switchLocale}
						className={styles.locale_switch}
					>
						{locale === "en" ? "한국어" : "English"}
					</button>
				</nav>

				{menuOpen && (
					<button
						type="button"
						className={styles.overlay}
						onClick={closeMenu}
						onKeyDown={(e) => e.key === "Escape" && closeMenu()}
						aria-label="Close menu"
					/>
				)}
			</div>
		</header>
	);
};

export default Header;
