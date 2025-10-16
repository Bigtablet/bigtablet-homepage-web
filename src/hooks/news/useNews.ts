"use client";

import { useCallback } from "react";
import { useNewsInfiniteQuery } from "src/queries/news/news.query";
import type { NewsItem } from "src/types/news/news.type";

const useNewsInfinite = (size = 9) => {
    const onSuccessHandler = useCallback((pages: NewsItem[][]) => {
        const total = pages.flat().length;
        console.log(`총 ${total}개의 뉴스 불러옴`);
    }, []);

    const query = useNewsInfiniteQuery(size);

    if (query.data) onSuccessHandler(query.data.pages);

    return query;
};

export default useNewsInfinite;