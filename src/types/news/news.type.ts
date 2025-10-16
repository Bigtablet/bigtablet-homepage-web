export type NewsItem = {
    idx: number;
    titleKr: string;
    titleEn: string;
    newsUrl: string;
    createdAt: string;
    modifiedAt: string;
};

export type NewsListResponse = {
    status: number;
    message: string;
    data: NewsItem[];
};