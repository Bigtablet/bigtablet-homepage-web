"use client";

import Link from "next/link";
import {useLocale} from "next-intl";
import "./style.scss";

const Footer = () => {
    const locale = useLocale(); // 필요하면 접근성/aria 용도로만 사용

    return (
        <footer className="footer">
            <div className="footer__inner">
                <div className="footer__left">
                    <strong className="footer__brand">Bigtablet, Inc.</strong>
                    <address className="footer__addr">440 N. Wolfe Rd, Sunnyvale, CA 94085</address>

                    <nav className="footer__links" aria-label="policies">
                        <Link href="/policies/privacy">Privacy Policy</Link>
                        <Link href="/policies/terms">Terms of Service</Link>
                        <Link href="/policies/cookies">Cookie Policy</Link>
                        <Link href="/policies/accessibility">Accessibility</Link>
                    </nav>
                </div>

                <ul className="footer__social" aria-label={`social links (${locale})`}>
                    <li>
                        <a
                            href="https://www.linkedin.com/company/bigtablet/posts/?feedView=all"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="LinkedIn"
                            className="footer__social-btn"
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                                <path fill="currentColor" d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5zM4 9h4v12H4zM10 9h3.8v1.7h.1c.5-.9 1.7-1.9 3.5-1.9C21 8.8 22 11 22 14.1V21H18v-6c0-1.4 0-3.1-1.9-3.1-1.9 0-2.1 1.5-2.1 3v6H10z"/>
                            </svg>
                        </a>
                    </li>
                    <li>
                        <a
                            target="_blank"
                            rel="noreferrer"
                            aria-label="X"
                            className="footer__social-btn"
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                                <path fill="currentColor" d="M18.9 2H22l-6.9 7.9L23 22h-6.8l-5.3-6.8L4.8 22H2l7.4-8.5L1 2h6.9l4.9 6.2L18.9 2zm-2.4 18h2.2L8.6 4H6.3l10.2 16z"/>
                            </svg>
                        </a>
                    </li>
                    <li>
                        <a
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Facebook"
                            className="footer__social-btn"
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                                <path fill="currentColor" d="M13.5 22v-8.5H16l.4-3H13.5V8.1c0-.9.3-1.5 1.6-1.5H16V4.1C15.6 4 14.7 4 13.7 4 11.4 4 9.8 5.4 9.8 7.8V10.5H7v3h2.8V22h3.7z"/>
                            </svg>
                        </a>
                    </li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;