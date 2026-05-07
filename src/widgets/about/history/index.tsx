"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	buildYearGroups,
	type YearGroup,
	yearsFromGroups,
} from "src/entities/about/history/util/group";
import { gsap } from "src/shared/libs/gsap";
import styles from "./style.module.scss";

export interface HistoryItemType {
	id: string;
	year: number;
	title: string;
	description?: string;
	dateLabel?: string;
}

type Props = { items: HistoryItemType[] };

/**
 * @component History
 *
 * @description
 * About 페이지 연혁 섹션.
 * 연도별 탭 네비게이션과 GSAP 전환 애니메이션을 적용한다.
 *
 * @param props.items - 연혁 데이터 배열
 * @see {@link buildYearGroups} 연도별 그룹핑 유틸
 */
const History = ({ items }: Props) => {
	const groups: YearGroup[] = useMemo(() => buildYearGroups(items), [items]);
	const years = useMemo(() => yearsFromGroups(groups), [groups]);
	const [currentYear, setCurrentYear] = useState<number | null>(null);
	const contentRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!groups.length) return;
		setCurrentYear((previous) => previous ?? groups[0].year);
	}, [groups]);

	const activeGroup = useMemo(
		() => (currentYear ? (groups.find((group) => group.year === currentYear) ?? null) : null),
		[groups, currentYear],
	);

	const animateIn = useCallback(() => {
		if (!contentRef.current) return;
		const rows = contentRef.current.querySelectorAll(`.${styles.history_row}`);
		/* 컨테이너 자체는 inline opacity:0으로 mount 됨 — to로 fade-in (이미 from 상태가 JSX에 정의됨) */
		gsap.to(contentRef.current, {
			opacity: 1,
			duration: 0.28,
			ease: "power2.out",
		});
		gsap.fromTo(
			rows,
			{ opacity: 0, y: 6 },
			{
				opacity: 1,
				y: 0,
				duration: 0.24,
				ease: "power2.out",
				stagger: 0.05,
				delay: 0.05,
			},
		);
	}, []);

	const handleYearChange = useCallback(
		(year: number) => {
			if (year === currentYear) return;
			/* fade-out → swap → fade-in 사이클 제거. 즉시 swap + key 변경으로 fresh mount.
			   새 컨테이너는 inline opacity:0으로 마운트되어 flash 없음. animateIn이 fade-in 담당. */
			setCurrentYear(year);
		},
		[currentYear],
	);

	useEffect(() => {
		if (activeGroup) {
			requestAnimationFrame(animateIn);
		}
	}, [activeGroup, animateIn]);

	return (
		<section className={styles.history}>
			<div className={styles.history_grid}>
				{/* 연도 네비게이션 (sticky) */}
				<div className={styles.history_years}>
					{years.map((year) => (
						<button
							key={year}
							type="button"
							className={`${styles.history_year_item} ${currentYear === year ? styles.is_active : ""}`}
							onClick={() => handleYearChange(year)}
						>
							<span className={styles.history_year_text}>{year}</span>
						</button>
					))}
				</div>

				{/* 내용 — initial opacity:0으로 mount → animateIn에서 fade-in 처리 */}
				{activeGroup && (
					<div
						ref={contentRef}
						key={activeGroup.year}
						className={styles.history_right}
						style={{ opacity: 0 }}
					>
						{activeGroup.list.map((historyItem) => (
							<div key={historyItem.id} className={styles.history_row}>
								<span className={styles.history_row_dot} aria-hidden />
								<div className={styles.history_row_body}>
									<div className={styles.history_row_title}>{historyItem.title}</div>
									{historyItem.description && (
										<div className={styles.history_row_desc}>{historyItem.description}</div>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</section>
	);
};

export default History;
