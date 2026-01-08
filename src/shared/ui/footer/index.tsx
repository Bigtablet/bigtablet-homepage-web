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
                    <strong className={styles.footer_brand}>
                        {t("brand")}
                    </strong>

                    <address className={styles.footer_addr}>
                        {t("address")}
                    </address>

                    {t.has("company_info") && (
                        <p>{t("company_info")}</p>
                    )}

                    {t.has("contact") && (
                        <p>{t("contact")}</p>
                    )}

                    {t.has("cs") && (
                        <p>{t("cs")}</p>
                    )}

                    {t.has("cs_tel") && (
                        <p>{t("cs_tel")}</p>
                    )}

                    <nav
                        className={styles.footer_links}
                        aria-label="policies"
                    >
                        <Link href="/policies/privacy">
                            {t("policies.privacy")}
                        </Link>
                        <Link href="/policies/terms">
                            {t("policies.terms")}
                        </Link>
                        <Link href="/policies/cookies">
                            {t("policies.cookies")}
                        </Link>
                        <Link href="/policies/accessibility">
                            {t("policies.accessibility")}
                        </Link>
                    </nav>
                </div>

                <ul className={styles.footer_social} aria-label="social links">
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