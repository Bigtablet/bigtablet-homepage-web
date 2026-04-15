"use client";

import { useRouter } from "next/navigation";
import styles from "./style.module.scss";

type Props = {
	href?: string;
	label: string;
};

/**
 * @description
 * 이전 페이지로 돌아가는 버튼 컴포넌트.
 * 히스토리가 있으면 router.back()을, 없으면 href로 이동한다.
 */
const BackLink = ({ href, label }: Props) => {
	const router = useRouter();

	const handleBack = () => {
		const hasHistory = typeof window !== "undefined" && window.history.length > 1;
		if (hasHistory) {
			router.back();
		} else if (href) {
			router.push(href);
		}
	};

	return (
		<button type="button" className={styles.back_link} onClick={handleBack}>
			← {label}
		</button>
	);
};

export default BackLink;
