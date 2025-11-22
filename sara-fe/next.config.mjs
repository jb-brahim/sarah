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
    unoptimized: true,
  },
}

export default nextConfig
