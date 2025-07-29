/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true, // Add trailing slashes for static hosting
  output: 'export', // Enable static site generation for GitHub Pages
  images: {
    unoptimized: true, // Disable image optimization for static export
  },
  allowedDevOrigins: ['192.168.1.*'], // Only affects development, ignored in production
};

export default nextConfig;