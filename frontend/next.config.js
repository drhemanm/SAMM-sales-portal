/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['firebasestorage.googleapis.com'],
    formats: ['image/webp', 'image/avif'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'development' 
          ? 'http://localhost:5001/meat-market-portal/us-central1/api/:path*'
          : 'https://us-central1-meat-market-portal.cloudfunctions.net/api/:path*'
      }
    ];
  },
}

module.exports = nextConfig;
