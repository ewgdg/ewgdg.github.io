/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Enable static site generation
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
}

export default nextConfig;