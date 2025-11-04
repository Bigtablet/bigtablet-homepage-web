export const ellipsis = (text?: string | null, max = 120) => {
    if (!text) return "";
    if (text.length <= max) return text;
    return text.slice(0, max).trimEnd() + "…";
};