/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['i.pixiv.re', 'guyinga.top', 'feature-cente.vercel.app'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.pixiv.re',
      },
      {
        protocol: 'https',
        hostname: 'guyinga.top',
      },
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      }
    ]
  },
  // 添加编译时优化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // 优化构建输出
  output: 'standalone',
  // 添加环境变量
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  }
};

module.exports = nextConfig; 