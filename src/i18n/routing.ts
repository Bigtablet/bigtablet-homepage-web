export const routing = {
    locales: ['ko', 'en'] as const,
    defaultLocale: 'ko' as const
};
export type AppLocale = (typeof routing.locales)[number];