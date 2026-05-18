import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/no-reins',
        destination: '/eal/no-reins',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
