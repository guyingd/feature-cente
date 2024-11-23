'use client';

import { motion } from 'framer-motion';
import { 
  HeartIcon,
  CodeBracketIcon,
  CommandLineIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  UserIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    title: 'Pixiv涩图',
    description: '精选优质二次元插画，支持多种筛选，标签搜索，包含全年龄和 R18 内容分级'
  },
  {
    title: '硬件排行',
    description: '全网最新的CPU、GPU和手机处理器性能排行榜，帮助您了解硬件性能'
  },
  {
    title: 'AI 助手',
    description: '基于先进的AI模型，为您提供智能问答服务'
  },
  {
    title: '视频播放',
    description: '精选短视频随机播放，支持自动播放和切换'
  },
  {
    title: '买家秀',
    description: '随机展示淘宝买家秀图片，带来欢乐时光'
  },
  {
    title: '应用搜索',
    description: '搜索并下载葫芦侠市场应用资源'
  }
];

export default function About() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            关于我们
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            致力于提供优质的在线工具和服务
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 space-y-8"
        >
          {/* 功能特点 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 text-2xl font-semibold mb-4">
              <SparklesIcon className="h-6 w-6 text-purple-500" />
              <h2>功能特点</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                >
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 技术栈 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 text-2xl font-semibold mb-4">
              <CodeBracketIcon className="h-6 w-6 text-blue-500" />
              <h2>技术栈</h2>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>前端框架：Next.js 14 + React + TypeScript</li>
                <li>UI 框架：Tailwind CSS + Framer Motion</li>
                <li>开发工具：Cursor AI 辅助编程</li>
                <li>部署环境：Vercel</li>
              </ul>
            </div>
          </div>

          {/* API 支持 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 text-2xl font-semibold mb-4">
              <GlobeAltIcon className="h-6 w-6 text-green-500" />
              <h2>API 支持</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <HeartIcon className="h-5 w-5 text-pink-500" />
                  Pixiv涩图 API
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  感谢 
                  <a 
                    href="https://api.lolicon.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-500 hover:text-purple-600 dark:text-purple-400 
                      dark:hover:text-purple-300 hover:underline"
                  >
                    Lolicon API
                  </a>
                  {' '}提供的优质二次元图片 API 支持。
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <SparklesIcon className="h-5 w-5 text-blue-500" />
                  其他功能 API
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  感谢 
                  <a 
                    href="https://api.pearktrue.cn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-500 hover:text-purple-600 dark:text-purple-400 
                      dark:hover:text-purple-300 hover:underline"
                  >
                    api.pearktrue.cn
                  </a>
                  {' '}提供的其他功能 API 支持。
                </p>
              </div>
            </div>
          </div>

          {/* 作者信息 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 text-2xl font-semibold mb-4">
              <UserIcon className="h-6 w-6 text-orange-500" />
              <h2>作者信息</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <UserIcon className="h-5 w-5" />
                <span>孤影</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <EnvelopeIcon className="h-5 w-5" />
                <a 
                  href="mailto:2739218253@qq.com"
                  className="text-purple-500 hover:text-purple-600 dark:text-purple-400 
                    dark:hover:text-purple-300"
                >
                  2739218253@qq.com
                </a>
              </div>
            </div>
          </div>

          {/* 开源协议 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 text-2xl font-semibold mb-4">
              <CommandLineIcon className="h-6 w-6 text-red-500" />
              <h2>开源协议</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              本项目采用 MIT 开源协议，欢迎使用和贡献。
            </p>
          </div>

          {/* 底部签名 */}
          <div className="flex items-center justify-center gap-2 mt-8 text-gray-500 dark:text-gray-400">
            <HeartIcon className="h-5 w-5 text-red-500" />
            <span>Made with love by 孤影</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 