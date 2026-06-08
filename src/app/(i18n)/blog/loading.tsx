import BlogListSkeleton from "src/widgets/blog/list/skeleton";

/**
 * @description
 * /blog 라우트 segment loading. 서버 prefetch 진행 중 즉시 스트리밍되는 셸.
 * page.tsx의 await prefetchQuery 동안 사용자에게 즉시 시각 피드백 제공.
 */
const BlogLoading = () => <BlogListSkeleton />;

export default BlogLoading;
