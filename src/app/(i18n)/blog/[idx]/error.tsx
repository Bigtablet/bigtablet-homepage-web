"use client";

import ErrorFallback from "src/shared/ui/error-fallback";

const BlogDetailError = ({ reset }: { error: Error; reset: () => void }) => {
    return <ErrorFallback reset={reset} backHref="/blog" backLabel="블로그 목록으로 돌아가기" />;
};

export default BlogDetailError;
