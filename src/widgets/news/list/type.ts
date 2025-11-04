import {NewsItem} from "src/entities/news/model/schema/news.schema";

export interface NewsListProps {
    items: NewsItem[];
    locale: string;
    isLoading: boolean;
    pageSize: number;
};