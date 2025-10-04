/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 15 no longer needs experimental for server components external packages
  // Moving this to the stable config
  serverExternalPackages: ['bcryptjs'],
  eslint: {
    // Allow production builds to successfully complete even if ESLint errors are present
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
