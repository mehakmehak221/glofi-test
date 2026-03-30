import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'glofi-api.maxtron.ai',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'aws-glofi-uploads.s3.ap-south-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  devIndicators: false,
};

export default nextConfig;
