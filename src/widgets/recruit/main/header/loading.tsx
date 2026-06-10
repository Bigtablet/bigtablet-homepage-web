"use client";

import type { RecruitSearchFilters } from "src/entities/recruit/api/recruit.api";
import RecruitHeader from ".";
import styles from "./style.module.scss";

const EMPTY_FILTERS: RecruitSearchFilters = { keyword: "", job: "", education: "", career: "" };

const noop = () => {};

/**
 * @description
 * route loading.tsx(server)에서 실물 헤더를 그대로 노출하기 위한 client 래퍼.
 * 검색/필터 동작은 page-client 하이드레이션 직후 활성화되므로 여기선 no-op.
 * 헤더는 데이터 의존이 없어 로딩 중에도 스켈레톤 대신 실제 UI 를 보여준다.
 * 하이드레이션 전 죽은 입력을 막기 위해 pointer-events 차단 (dim 처리는 의도상 미적용).
 */
const RecruitHeaderLoading = () => (
	<div className={styles.recruit_header_loading}>
		<RecruitHeader filters={EMPTY_FILTERS} onChange={noop} />
	</div>
);

export default RecruitHeaderLoading;
