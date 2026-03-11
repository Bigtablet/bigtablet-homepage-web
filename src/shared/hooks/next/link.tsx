"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof Link> & {
	underline?: boolean;
};

/**
 * @description
 * 기본 링크에 공통 클래스를 부여하는 컴포넌트입니다.
 *
 * @param props - Next.js Link props
 * @returns 공통 스타일이 적용된 링크
 */
export const BigtabletLink = ({
	underline = false,
	className,
	...props
}: Props) => {
	const classNames = ["bt_link", underline && "bt_link--underline", className]
		.filter(Boolean)
		.join(" ");

	return <Link {...props} className={classNames} />;
};
