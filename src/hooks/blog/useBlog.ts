"use client";

import { useCallback } from "react";
import { useBlogInfiniteQuery } from "src/queries/blog/blog.query";
import type { BlogItem } from "src/types/blog/blog.type";

const useBlog = (size = 9) => {
    const onSuccessHandler = useCallback((pages: BlogItem[][]) => {
        const total = pages.flat().length;
        console.log(`총 ${total}개의 블로그 글 불러옴`);
    }, []);

    const query = useBlogInfiniteQuery(size);

    if (query.data) onSuccessHandler(query.data.pages);

    return query;
};

export default useBlog;