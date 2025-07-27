/** @type {import('next').NextConfig} */
const baseConfig = {
  reactStrictMode: true,
  trailingSlash: true, // Add trailing slashes for static hosting
  images: {
    unoptimized: true, // Disable image optimization for static export
  },
  // App Router is enabled by default in Next.js 13+, no experimental flag needed
  webpack: (config, { isServer }) => {
    // Handle PIXI.js
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }

    return config;
  },
};

const nextConfig = process.env.NODE_ENV === 'development' 
  ? {
      ...baseConfig,
      async rewrites() {
        return {
          beforeFiles: [
            {
              source: '/admin/',
              destination: '/admin/index.html',
            },
          ],
        };
      },
    }
  : {
      ...baseConfig,
      output: 'export', // Enable static site generation only for production
    };

export default nextConfig;