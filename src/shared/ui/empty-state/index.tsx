import styles from "./style.module.scss";

interface EmptyStateProps {
	/** 표시할 안내 메시지 */
	message: string;
}

/** 목록 빈 상태 공용 UI — 콘텐츠 영역 세로 중앙 정렬 */
const EmptyState = ({ message }: EmptyStateProps) => (
	<div className={styles.empty_state} role="status">
		<p>{message}</p>
	</div>
);

export default EmptyState;
