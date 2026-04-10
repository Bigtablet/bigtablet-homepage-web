"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef } from "react";
import Portal from "src/shared/libs/ui/portal/portal";
import styles from "./style.module.scss";
import type { ModalItem, ModalProps } from "./type";

const CLOSE_INTENT_DELAY = 180;

/**
 * @component Modal
 *
 * @description
 * 솔루션 제품 상세 모달. 좌우 슬라이드 네비게이션과
 * 제품 비디오 재생을 지원한다. ESC 키로 닫을 수 있다.
 *
 * @see {@link Portal} 모달 포탈 렌더링
 */
const Modal = ({
	current,
	ghost,
	sliding,
	animVars,
	isEntering,
	blockBackdropClose,
	prev,
	next,
	close,
}: ModalProps) => {
	const t = useTranslations("main.solution");
	const intentTimerRef = useRef<number | null>(null);

	const styleVars = useMemo(() => {
		if (!animVars) return {};
		return {
			"--from-dx": `${animVars.dx}px`,
			"--from-dy": `${animVars.dy}px`,
			"--from-sx": animVars.sx,
			"--from-sy": `${animVars.sy}`,
		} as React.CSSProperties & Record<string, string | number>;
	}, [animVars]);

	const renderPanel = (item: ModalItem) => (
		<div className={styles.solution_modal_panel}>
			<div className={styles.solution_modal_left}>
				<h3 className={styles.solution_modal_title}>{t(`product.${item.id}.title`)}</h3>
				<p className={styles.solution_modal_desc}>{t(`product.${item.id}.description`)}</p>
			</div>
			<div className={styles.solution_modal_right}>
				<video
					className={styles.solution_modal_video}
					src={item.src}
					autoPlay
					muted
					playsInline
					loop
					preload="metadata"
				/>
			</div>
		</div>
	);

	const armCloseIntent = () => {
		if (blockBackdropClose) return;
		if (intentTimerRef.current) window.clearTimeout(intentTimerRef.current);
		intentTimerRef.current = window.setTimeout(() => {
			intentTimerRef.current = null;
			close();
		}, CLOSE_INTENT_DELAY);
	};

	const cancelCloseIntent = () => {
		if (intentTimerRef.current) {
			window.clearTimeout(intentTimerRef.current);
			intentTimerRef.current = null;
		}
	};

	useEffect(() => {
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape" && !blockBackdropClose) close();
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [blockBackdropClose, close]);

	return (
		<Portal>
			<div
				className={`${styles.solution_modal_backdrop} ${blockBackdropClose ? styles.is_locked : ""}`}
				onClick={blockBackdropClose ? undefined : close}
				onMouseLeave={(e) => {
					const related = (e as React.MouseEvent).relatedTarget as Node | null;
					if (!related) armCloseIntent();
				}}
				onMouseEnter={cancelCloseIntent}
				role="presentation"
			>
				<div
					className={`${styles.solution_modal} ${isEntering ? styles.is_enter : ""}`}
					style={styleVars}
					onClick={(e) => e.stopPropagation()}
					role="presentation"
				>
					<button
						type="button"
						className={`${styles.solution_modal_nav} ${styles.solution_modal_nav_prev}`}
						onClick={prev}
						aria-label="previous"
					>
						‹
					</button>

					<div className={styles.solution_modal_content} role="dialog" aria-modal="true">
						<div
							className={`${styles.solution_modal_track} ${
								sliding
									? sliding.dir === "next"
										? styles.is_slide_next
										: styles.is_slide_prev
									: ""
							}`}
						>
							{sliding?.dir === "prev" && ghost && renderPanel(ghost)}
							{renderPanel(current)}
							{sliding?.dir === "next" && ghost && renderPanel(ghost)}
						</div>
					</div>

					<button
						type="button"
						className={`${styles.solution_modal_nav} ${styles.solution_modal_nav_next}`}
						onClick={next}
						aria-label="next"
					>
						›
					</button>
				</div>
			</div>
		</Portal>
	);
};

export default Modal;
