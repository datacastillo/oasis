import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/nessie-api/:path*',
        destination: 'http://api.nessieisreal.com/:path*',
      },
    ];
  },
};

export default nextConfig;