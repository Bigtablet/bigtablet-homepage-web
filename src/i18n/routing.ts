export const routing = {
    locales: ['ko', 'en'] as const,
    defaultLocale: 'en' as const,
    localePrefix: { mode: 'as-needed' } as const,
};
export type AppLocale = (typeof routing.locales)[number];