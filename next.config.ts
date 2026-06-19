import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Redirect old EAL URLs to new structure
      {
        source: '/eal',
        destination: '/experiences',
        permanent: true,
      },
      {
        source: '/programs',
        destination: '/experiences',
        permanent: true,
      },
      {
        source: '/eal/no-reins',
        destination: '/no-reins',
        permanent: true,
      },
      {
        source: '/eal/corporate',
        destination: '/corporate',
        permanent: true,
      },
      {
        source: '/eal/mustang',
        destination: '/mustang',
        permanent: true,
      },
      {
        source: '/eal/about',
        destination: '/about/dawn',
        permanent: true,
      },
      {
        source: '/eal/contact',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/eal/womens-retreat/:path*',
        destination: '/no-reins/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
