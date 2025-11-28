import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin({});

const nextConfig = {
    output: "standalone",

    images: {
        domains: ['storage.googleapis.com']
    },

    async redirects() {
        return [
            { source: '/', destination: '/main', permanent: true }
        ];
    },

    sassOptions: {
        includePaths: ["./src/shared/styles"],
    },
};

export default withNextIntl(nextConfig);