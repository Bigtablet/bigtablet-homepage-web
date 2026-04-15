"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState } from "react";
import styles from "./style.module.scss";

/**
 * 페이지 전환 시 부드러운 fade-in 효과를 적용합니다.
 * pathname 변경 감지 → 잠시 hidden → fade-in으로 자연스러운 전환.
 */
const PageTransition = ({ children }: { children: ReactNode }) => {
	const pathname = usePathname();
	const [phase, setPhase] = useState<"visible" | "entering">("visible");
	const prevPathRef = useRef(pathname);

	useEffect(() => {
		if (prevPathRef.current === pathname) return;
		prevPathRef.current = pathname;

		// 새 페이지 콘텐츠가 마운트된 직후 — opacity:0 적용 후 다음 프레임에서 fade-in
		setPhase("entering");
		const frame = requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				setPhase("visible");
			});
		});
		return () => cancelAnimationFrame(frame);
	}, [pathname]);

	const className =
		phase === "entering"
			? `${styles.transition} ${styles.entering}`
			: `${styles.transition} ${styles.visible}`;

	return <div className={className}>{children}</div>;
};

export default PageTransition;
