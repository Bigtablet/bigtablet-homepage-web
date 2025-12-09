export const getSourceFromUrl = (raw: string) => {
    try {
        const u = new URL(raw);
        return u.hostname.replace(/^www\./, "");
    } catch {
        return "";
    }
};

export const getPreviewUrl = (raw: string) =>
    `/api/news/preview?u=${encodeURIComponent(raw)}`;