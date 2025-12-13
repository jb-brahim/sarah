/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack workspace root: set to this package's folder to silence
  // the "inferred workspace root" warning when other lockfiles exist
  turbopack: {
    root: '.'
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'img-4.linternaute.com',
      },
      {
        protocol: 'https',
        hostname: 'tse2.mm.bing.net',
      },
    ],
  },
}

export default nextConfig
