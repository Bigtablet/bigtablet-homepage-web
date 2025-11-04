import type {BlogItem} from "src/entities/blog/model/schema/blog.schema";

export interface BlogListProps {
    items: BlogItem[];
    locale: string;
    isLoading: boolean;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
    pageSize: number;
    hrefBuilder?: (item: BlogItem, locale: string) => string;
};