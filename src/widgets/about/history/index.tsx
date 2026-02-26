"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "src/shared/libs/gsap";
import styles from "./style.module.scss";
import {
	buildYearGroups,
	type YearGroup,
	yearsFromGroups,
} from "src/entities/about/history/util/group";

export interface HistoryItemType {
	id: string;
	year: number;
	title: string;
	description?: string;
	dateLabel?: string;
}

type Props = { items: HistoryItemType[] };

const History = ({ items }: Props) => {
	const groups: YearGroup[] = useMemo(() => buildYearGroups(items), [items]);
	const years = useMemo(() => yearsFromGroups(groups), [groups]);
	const [currentYear, setCurrentYear] = useState<number | null>(null);
	const contentRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		if (!groups.length) return;
		setCurrentYear((prev) => prev ?? groups[0].year);
	}, [groups]);

	const activeGroup = useMemo(
		() =>
			currentYear
				? groups.find((g) => g.year === currentYear) ?? null
				: null,
		[groups, currentYear],
	);

	const animateIn = useCallback(() => {
		if (!contentRef.current) return;
		const rows = contentRef.current.querySelectorAll(`.${styles.history_row}`);
		gsap.fromTo(
			contentRef.current,
			{ opacity: 0 },
			{ opacity: 1, duration: 0.32, ease: "power2.inOut" },
		);
		gsap.fromTo(
			rows,
			{ opacity: 0, y: 6 },
			{
				opacity: 1,
				y: 0,
				duration: 0.24,
				ease: "power2.out",
				stagger: 0.06,
				delay: 0.1,
			},
		);
	}, []);

	const handleYearChange = useCallback(
		(year: number) => {
			if (!contentRef.current || year === currentYear) return;

			gsap.to(contentRef.current, {
				opacity: 0,
				duration: 0.2,
				ease: "power2.in",
				onComplete: () => {
					setCurrentYear(year);
				},
			});
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
			<div className={styles.history_sticky}>
				<div className={styles.history_years}>
					{years.map((y) => (
						<button
							key={y}
							type="button"
							className={`${styles.history_year_item} ${currentYear === y ? styles.is_active : ""}`}
							onClick={() => handleYearChange(y)}
						>
							<span className={styles.history_year_text}>
								{y}
							</span>
						</button>
					))}
				</div>
			</div>

			{activeGroup && (
				<section
					ref={contentRef}
					key={activeGroup.year}
					className={styles.history_year_block}
				>
					<div className={styles.history_left} />
					<div className={styles.history_right}>
						{activeGroup.list.map((it) => (
							<div key={it.id} className={styles.history_row}>
								<span
									className={styles.history_row_dot}
									aria-hidden
								/>
								<div className={styles.history_row_body}>
									<div className={styles.history_row_title}>
										{it.title}
									</div>
									{it.description && (
										<div
											className={
												styles.history_row_desc
											}
										>
											{it.description}
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				</section>
			)}
		</section>
	);
};

export default History;
