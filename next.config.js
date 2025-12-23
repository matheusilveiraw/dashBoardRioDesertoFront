/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                path: false,
                os: false,
                net: false,
                stream: false,
                tls: false,
                crypto: false,
                child_process: false,
                encoding: false,
                debug: false,
            };
        }
        return config;
    },
};

module.exports = nextConfig;
