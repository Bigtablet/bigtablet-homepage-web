import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
    images: { domains: ['storage.googleapis.com'] },
    i18n: {
        locales: ['ko', 'en'],
        defaultLocale: 'ko',
        localeDetection: false,
    },
};

export default withNextIntl(nextConfig);