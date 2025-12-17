"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import styles from "./style.module.scss";

const Footer = () => {
    const locale = useLocale();

    return (
        <footer className={styles.footer}>
            <div className={styles.footer_inner}>
                <div className={styles.footer_left}>
                    <strong className={styles.footer_brand}>Bigtablet, Inc.</strong>
                    <address className={styles.footer_addr}>
                        440 N. Wolfe Rd, Sunnyvale, CA 94085
                    </address>

                    <nav
                        className={styles.footer_links}
                        aria-label="policies"
                    >
                        <Link href="/policies/privacy">Privacy Policy</Link>
                        <Link href="/policies/terms">Terms of Service</Link>
                        <Link href="/policies/cookies">Cookie Policy</Link>
                        <Link href="/policies/accessibility">Accessibility</Link>
                    </nav>
                </div>

                <ul
                    className={styles.footer_social}
                    aria-label={`social links (${locale})`}
                >
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