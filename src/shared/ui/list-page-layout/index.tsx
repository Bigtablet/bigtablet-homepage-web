import type { ReactNode } from "react";
import styles from "./style.module.scss";

interface ListPageLayoutProps {
	children: ReactNode;
}

/**
 * @component ListPageLayout
 *
 * @description
 * 블로그·뉴스·채용 목록 페이지 공용 레이아웃.
 * 세 페이지에 동일한 max-width·패딩·정렬을 적용하고, 가용 높이를 채워(`flex:1`)
 * 콘텐츠를 **상단 고정**·footer를 하단 고정한다. 데이터 개수가 변해도 콘텐츠
 * 시작 위치가 흔들리지 않는다.
 *
 * - 데이터가 있을 때: 자식(grid/list + pagination)이 상단부터 쌓임
 * - 데이터가 없을 때: `flex:1`을 가진 EmptyState가 영역을 채워 세로 중앙 정렬
 */
const ListPageLayout = ({ children }: ListPageLayoutProps) => (
	<div className={styles.list_page}>{children}</div>
);

export default ListPageLayout;
