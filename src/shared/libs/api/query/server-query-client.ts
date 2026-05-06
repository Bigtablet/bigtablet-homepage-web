import { QueryClient } from "@tanstack/react-query";

/**
 * @description
 * SSR prefetch용 QueryClient 팩토리.
 *
 * staleTime을 설정하지 않으면 hydration 직후 client에서 데이터를 stale로
 * 판단해 즉시 background refetch를 일으켜 prefetch 효과가 반감된다.
 * 60초 정도면 hydration ~ 첫 인터랙션 사이엔 충분히 캐시 hit.
 */
export const createServerQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000,
			},
		},
	});
