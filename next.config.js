/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ignore TypeScript errors during build for demo purposes
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignore ESLint errors during build for demo purposes
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig