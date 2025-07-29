/** @type {import('next').NextConfig} */
const baseConfig = {
  reactStrictMode: true,
  trailingSlash: true, // Add trailing slashes for static hosting
  images: {
    unoptimized: true, // Disable image optimization for static export
  },
};

const nextConfig = process.env.NODE_ENV === 'development'
  ? {
    ...baseConfig,
    allowedDevOrigins: ['192.168.1.*'],
  } : {
    ...baseConfig,
    output: 'export', // Enable static site generation only for production
  };

export default nextConfig;