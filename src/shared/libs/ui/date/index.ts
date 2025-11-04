export const formatRelative = (dateStr?: string, locale?: string) => {
    if (!dateStr || !locale) return "";
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = d.getTime() - now.getTime();
    const absSec = Math.round(Math.abs(diffMs) / 1000);
    const rtf = new Intl.RelativeTimeFormat(locale.startsWith("ko") ? "ko" : "en", { numeric: "auto" });

    if (absSec < 60) return rtf.format(Math.round(diffMs / 1000), "second");
    const absMin = Math.round(absSec / 60);
    if (absMin < 60) return rtf.format(Math.round(diffMs / (60 * 1000)), "minute");
    const absHr = Math.round(absMin / 60);
    if (absHr < 24) return rtf.format(Math.round(diffMs / (60 * 60 * 1000)), "hour");
    return rtf.format(Math.round(diffMs / (24 * 60 * 60 * 1000)), "day");
};