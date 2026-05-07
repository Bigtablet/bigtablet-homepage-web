"use client";

import { Button } from "@bigtablet/design-system";
import { useTranslations } from "next-intl";
import { BigtabletLink } from "src/shared/hooks/next";
import styles from "./style.module.scss";

interface ErrorFallbackProps {
	/** error.tsx에서 전달되는 reset 함수 */
	reset: () => void;
	/** 목록 페이지로 돌아가기 링크 */
	backHref?: string;
	/** 돌아가기 버튼 텍스트. 미지정 시 common.backToListGeneric 사용 */
	backLabel?: string;
}

/** 세그먼트 에러 바운더리 공용 UI */
const ErrorFallback = ({ reset, backHref, backLabel }: ErrorFallbackProps) => {
	const t = useTranslations("error");
	const tCommon = useTranslations("common");

	return (
		<div className={styles.error_fallback} role="alert">
			<h2 className={styles.error_fallback_title}>{t("title")}</h2>
			<p className={styles.error_fallback_desc}>{t("description")}</p>

			<div className={styles.error_fallback_actions}>
				<Button variant="primary" onClick={() => reset()}>
					{t("retry")}
				</Button>

				{backHref && (
					<BigtabletLink href={backHref} className={styles.error_fallback_back}>
						{backLabel ?? tCommon("backToListGeneric")}
					</BigtabletLink>
				)}
			</div>
		</div>
	);
};

export default ErrorFallback;
