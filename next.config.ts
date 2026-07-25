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
        hostname: 'cdn-images-1.medium.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'miro.medium.com',
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
  transpilePackages: ['@reduxjs/toolkit', 'react-redux'],
  devIndicators: false,
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [
      {
        source: '/.well-known/apple-app-site-association',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
      {
        source: '/.well-known/assetlinks.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
