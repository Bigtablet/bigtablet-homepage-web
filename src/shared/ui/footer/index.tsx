"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import styles from "./style.module.scss";

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
						<Link href="/policies/accessibility">
							{t("policies.accessibility")}
						</Link>
					</nav>
				</div>

				<ul className={styles.footer_social} aria-label="social links">
					<li>
						<a
							href="https://github.com/Bigtablet/bigtablet-homepage-web"
							target="_blank"
							rel="noreferrer"
							aria-label="GitHub"
							className={styles.footer_social_btn}
						>
							<svg
								viewBox="0 0 24 24"
								width="20"
								height="20"
								aria-hidden="true"
							>
								<path
									fill="currentColor"
									d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.338c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"
								/>
							</svg>
						</a>
					</li>
					<li>
						<a
							href="https://www.linkedin.com/company/bigtablet/posts/?feedView=all"
							target="_blank"
							rel="noreferrer"
							aria-label="LinkedIn"
							className={styles.footer_social_btn}
						>
							<svg
								viewBox="0 0 24 24"
								width="20"
								height="20"
								aria-hidden="true"
							>
								<path
									fill="currentColor"
									d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5zM4 9h4v12H4zM10 9h3.8v1.7h.1c.5-.9 1.7-1.9 3.5-1.9C21 8.8 22 11 22 14.1V21H18v-6c0-1.4 0-3.1-1.9-3.1-1.9 0-2.1 1.5-2.1 3v6H10z"
								/>
							</svg>
						</a>
					</li>
				</ul>
			</div>
		</footer>
	);
};

export default Footer;
