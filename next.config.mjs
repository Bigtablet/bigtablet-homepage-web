import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
    images: { domains: ['storage.googleapis.com'] },
};

export default withNextIntl(nextConfig);