import { BigtabletLink } from "src/shared/hooks/next";
import styles from "./style.module.scss";

type Props = {
	href: string;
	label: string;
};

/**
 * @description
 * 이전 페이지로 돌아가는 링크 컴포넌트입니다.
 * 상세/정책 페이지 등에서 공통으로 사용합니다.
 */
const BackLink = ({ href, label }: Props) => (
	<BigtabletLink href={href} className={styles.back_link}>
		← {label}
	</BigtabletLink>
);

export default BackLink;
