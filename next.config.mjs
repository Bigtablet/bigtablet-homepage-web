import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin({});

const nextConfig = {
    images: { domains: ['storage.googleapis.com'] },

    async redirects() {
        return [
            { source: '/', destination: '/main', permanent: true },
        ];
    },
};

export default withNextIntl(nextConfig);