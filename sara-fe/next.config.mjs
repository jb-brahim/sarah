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
      {
        protocol: 'https',
        hostname: 'www.historyhit.com',
      },
      {
        protocol: 'https',
        hostname: 'dynamic-media-cdn.tripadvisor.com',
      },
      {
        protocol: 'https',
        hostname: 'www.voyage-tunisie.com',
      },
      {
        protocol: 'https',
        hostname: 'media.tacdn.com',
      },
      {
        protocol: 'https',
        hostname: 'rootsabroadtravel.com',
      },
      {
        protocol: 'https',
        hostname: 'guide-voyage-tunisie.com',
      },
      {
        protocol: 'https',
        hostname: 'wildyness.com',
      },
      {
        protocol: 'https',
        hostname: 'resaprivee.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.getyourguide.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'cf.bstatic.com',
      },
    ],
  },
}

export default nextConfig
