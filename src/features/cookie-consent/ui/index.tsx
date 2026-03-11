"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import styles from "./style.module.scss";

const COOKIE_NAME = "cookie_consent";
const MAX_AGE = 60 * 60 * 24 * 365; // 1년

/** 쿠키 동의 여부를 확인하고 배너를 표시하는 컴포넌트 */
const CookieConsent = () => {
	const t = useTranslations("cookie");
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const hasConsent = document.cookie
			.split(";")
			.some((row) => row.trim().startsWith(`${COOKIE_NAME}=`));

		if (!hasConsent) setVisible(true);
	}, []);

	const setCookie = (value: string) => {
		document.cookie =
			`${COOKIE_NAME}=${value}; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax` +
			(process.env.NODE_ENV === "production" ? "; Secure" : "");
		setVisible(false);
	};

	if (!visible) return null;

	return (
		<>
			<div className={styles.overlay} />
			<div className={styles.banner} role="dialog" aria-label={t("message")}>
				<div className={styles.content}>
					<p className={styles.message}>
						{t("message")} <Link href="/policies/cookies">{t("link")}</Link>
					</p>
					<div className={styles.actions}>
						<button
							type="button"
							className={styles.button_decline}
							onClick={() => setCookie("declined")}
						>
							{t("decline")}
						</button>
						<button
							type="button"
							className={styles.button_accept}
							onClick={() => setCookie("accepted")}
						>
							{t("accept")}
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default CookieConsent;
