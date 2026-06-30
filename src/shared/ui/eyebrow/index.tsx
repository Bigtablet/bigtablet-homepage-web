import styles from "./style.module.scss";

interface EyebrowProps {
	children: React.ReactNode;
	className?: string;
}

/**
 * @component Eyebrow
 *
 * @description
 * 섹션 상단 라벨(eyebrow). 모노스페이스 대문자 + 앞쪽 액센트 대시(::before).
 * 임시 디자인의 `.ey` 를 그대로 옮긴 것 — "// " 접두 없이 짧은 청록 대시로 시작.
 */
const Eyebrow = ({ children, className }: EyebrowProps) => (
	<p className={`${styles.eyebrow} ${className ?? ""}`}>{children}</p>
);

export default Eyebrow;
