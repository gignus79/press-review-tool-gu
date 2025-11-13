/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  images: {
    domains: ['localhost'],
  },
  // Allow build to continue even if Google Fonts fetch fails
  typescript: {
    ignoreBuildErrors: false,
  },
}

export default nextConfig
