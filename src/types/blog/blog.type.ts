export type BlogItem = {
    idx: number;
    titleKr: string;
    titleEn: string;
    contentKr: string;
    contentEn: string;
    imageUrl: string;
    views: number;
    createdAt: string;
    modifiedAt: string;
};

export type BlogListResponse = {
    status: number;
    message: string;
    data: BlogItem[];
};