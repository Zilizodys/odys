/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  poweredByHeader: false,
  images: {
    domains: ['images.unsplash.com', 'lh3.googleusercontent.com'],
    unoptimized: true,
  },
}

module.exports = nextConfig 