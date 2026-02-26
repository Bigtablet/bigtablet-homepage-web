import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin({});

const nextConfig = {
    output: "standalone",

    images: {
        domains: ['storage.googleapis.com']
    },

    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'X-DNS-Prefetch-Control', value: 'on' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                ],
            },
        ];
    },

    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.SERVER_URL}/:path*`,
            },
            {
                source: '/media/:id*',
                destination: 'https://storage.googleapis.com/bigtablet-homepage/:id*',
            },
        ];
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