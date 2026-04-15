"use client";

import * as Sentry from "@sentry/nextjs";
import { type ReactNode, Suspense } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

interface Props {
	/** Suspense fallback (로딩 중 표시) */
	pendingFallback?: ReactNode;
	/** ErrorBoundary fallback (에러 발생 시 표시) */
	rejectedFallback: (props: FallbackProps) => ReactNode;
	/** 에러 리셋 트리거 키 (변경 시 자동 리셋) */
	resetKeys?: unknown[];
	children: ReactNode;
}

/**
 * @component AsyncBoundary
 *
 * @description
 * Suspense + ErrorBoundary 합성 컴포넌트.
 * 데이터 fetching 위젯을 감싸 로딩/에러 상태를 선언적으로 처리한다.
 */
const AsyncBoundary = ({ pendingFallback, rejectedFallback, resetKeys, children }: Props) => (
	<ErrorBoundary
		fallbackRender={rejectedFallback}
		onError={(error) => Sentry.captureException(error)}
		resetKeys={resetKeys}
	>
		<Suspense fallback={pendingFallback}>{children}</Suspense>
	</ErrorBoundary>
);

export default AsyncBoundary;
