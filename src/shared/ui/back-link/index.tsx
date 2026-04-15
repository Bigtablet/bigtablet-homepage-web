"use client";

import { useRouter } from "next/navigation";
import styles from "./style.module.scss";

type Props = {
	label: string;
};

/**
 * @description
 * 이전 페이지로 돌아가는 버튼 컴포넌트.
 * router.back()으로 브라우저 히스토리 기반 뒤로가기를 수행한다.
 */
const BackLink = ({ label }: Props) => {
	const router = useRouter();

	return (
		<button type="button" className={styles.back_link} onClick={() => router.back()}>
			← {label}
		</button>
	);
};

export default BackLink;
