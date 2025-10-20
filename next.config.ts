const withNextIntl = require('next-intl/plugin')();

const nextConfig = {
    images: { domains: ['storage.googleapis.com'] },
    // i18n: { locales: ['en','ko'], defaultLocale: 'en', localeDetection: false },
};

module.exports = withNextIntl(nextConfig);