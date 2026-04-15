"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState } from "react";
import styles from "./style.module.scss";

/**
 * 페이지 전환 시 부드러운 fade-in 효과를 적용합니다.
 * pathname 변경 감지 → 렌더 단계에서 즉시 hidden → 다음 프레임에서 fade-in.
 */
const PageTransition = ({ children }: { children: ReactNode }) => {
	const pathname = usePathname();
	const [phase, setPhase] = useState<"visible" | "entering">("visible");
	const prevPathRef = useRef(pathname);

	if (prevPathRef.current !== pathname) {
		prevPathRef.current = pathname;
		setPhase("entering");
	}

	useEffect(() => {
		if (phase === "entering") {
			const frame = requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					setPhase("visible");
				});
			});
			return () => cancelAnimationFrame(frame);
		}
	}, [phase]);

	const className =
		phase === "entering"
			? `${styles.transition} ${styles.entering}`
			: `${styles.transition} ${styles.visible}`;

	return <div className={className}>{children}</div>;
};

export default PageTransition;
