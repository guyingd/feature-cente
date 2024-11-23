/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'cdn.u1.huluxia.com',
      'i.pixiv.re',
      'cdn.tyy.huluxia.com',
      'cdn.volcengine.huluxia.com'
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