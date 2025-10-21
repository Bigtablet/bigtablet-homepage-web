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

export type BlogResponse = {
    status: number;
    message: string;
    data: BlogItem[];
};

export type BlogDetailResponse = {
    status: number;
    message: string;
    data: BlogItem
};

export type BlogCreateRequest = Pick<
    BlogItem,
    "titleKr" | "titleEn" | "contentKr" | "contentEn" | "imageUrl"
>;
export type BlogUpdateRequest = BlogCreateRequest & { idx: number };