"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import styles from "./style.module.scss";

/** 푸터 소셜 링크 — 정적 데이터/아이콘은 모듈 스코프로 hoist 해 매 렌더 재생성 방지 */
const SOCIAL_LINKS: { name: string; href: string; icon: ReactNode }[] = [
	{
		name: "LinkedIn",
		href: "https://www.linkedin.com/company/bigtablet/",
		icon: (
			<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
				<path
					fill="currentColor"
					d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5zM4 9h4v12H4zM10 9h3.8v1.7h.1c.5-.9 1.7-1.9 3.5-1.9C21 8.8 22 11 22 14.1V21H18v-6c0-1.4 0-3.1-1.9-3.1-1.9 0-2.1 1.5-2.1 3v6H10z"
				/>
			</svg>
		),
	},
	{
		name: "Instagram",
		href: "https://www.instagram.com/bigtablet_official/",
		icon: (
			<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
				<path
					fill="currentColor"
					d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.43-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.12 1.38C1.35 2.68.94 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.12.66.66 1.33 1.08 2.12 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.3 1.46-.72 2.12-1.38.66-.66 1.08-1.33 1.38-2.12.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.3-.79-.72-1.46-1.38-2.12C21.32 1.35 20.65.94 19.86.63 19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0m0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84M12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4m6.41-10.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44"
				/>
			</svg>
		),
	},
	{
		name: "X",
		href: "https://x.com/Inc_Bigtablet",
		icon: (
			<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
				<path
					fill="currentColor"
					d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
				/>
			</svg>
		),
	},
];

/**
 * @component Footer
 *
 * @description
 * 사이트 공통 푸터. client 컴포넌트 — server layout(서버 트리)뿐 아니라
 * "use client" 인 Template(error/not-found 페이지) 안에서도 렌더되어야 하므로
 * `useTranslations`(client hook) 사용. 부모의 NextIntlClientProvider 에 footer 메시지 포함.
 * (이전엔 async server + getTranslations 라 client 트리에서 렌더 시 크래시했음)
 */
const Footer = () => {
	const t = useTranslations("footer");

	return (
		<footer className={styles.footer}>
			<div className={styles.footer_inner}>
				<div className={styles.footer_left}>
					<strong className={styles.footer_brand}>{t("brand")}</strong>

					<address className={styles.footer_addr}>{t("address")}</address>

					{t.has("company_info") && <p>{t("company_info")}</p>}

					{t.has("contact") && <p>{t("contact")}</p>}

					{t.has("cs") && <p>{t("cs")}</p>}

					{t.has("cs_tel") && <p>{t("cs_tel")}</p>}

					<nav className={styles.footer_links} aria-label="policies">
						<Link href="/policies/privacy">{t("policies.privacy")}</Link>
						<Link href="/policies/terms">{t("policies.terms")}</Link>
						<Link href="/policies/cookies">{t("policies.cookies")}</Link>
						<Link href="/policies/accessibility">{t("policies.accessibility")}</Link>
					</nav>
				</div>

				<ul className={styles.footer_social} aria-label="social links">
					{SOCIAL_LINKS.map(({ name, href, icon }) => (
						<li key={name}>
							<a
								href={href}
								target="_blank"
								rel="noopener noreferrer"
								className={styles.footer_social_btn}
							>
								<span className={styles.sr_only}>{name}</span>
								{icon}
							</a>
						</li>
					))}
				</ul>
			</div>
		</footer>
	);
};

export default Footer;
