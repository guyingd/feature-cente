'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  SparklesIcon, 
  ArrowRightIcon,
  RocketLaunchIcon,
  ChatBubbleBottomCenterTextIcon,
  ComputerDesktopIcon,
  PhotoIcon,
  HeartIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  NewspaperIcon,
  CpuChipIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    icon: HeartIcon,
    title: 'Pixiv涩图',
    description: '精选优质二次元插画，支持多种筛选，标签搜索，每日更新',
    color: 'from-pink-500 to-rose-500',
    highlight: true
  },
  {
    icon: ComputerDesktopIcon,
    title: '硬件排行',
    description: '全网最新的CPU、GPU和手机处理器性能排行榜',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: ChatBubbleBottomCenterTextIcon,
    title: 'AI 助手',
    description: '智能AI助手，为您解答各种问题',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: VideoCameraIcon,
    title: '视频播放',
    description: '精选短视频，随机播放',
    color: 'from-red-500 to-orange-500'
  },
  {
    icon: PhotoIcon,
    title: '买家秀',
    description: '随机淘宝买家秀图片，让您捧腹大笑',
    color: 'from-orange-500 to-yellow-500'
  },
  {
    icon: RocketLaunchIcon,
    title: '应用搜索',
    description: '海量应用资源，一键搜索下载',
    color: 'from-green-500 to-emerald-500'
  }
];

export default function Home() {
  return (
    <div className="min-h-screen py-20">
      {/* 头部区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
            功能中心
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            探索我们提供的各种实用功能
          </p>
        </motion.div>

        {/* 特色功能展示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 max-w-3xl mx-auto bg-gradient-to-r from-pink-500 to-rose-500 
            rounded-2xl p-1 shadow-lg"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8">
            <div className="flex items-center justify-center gap-3 text-pink-500 mb-4">
              <HeartIcon className="h-8 w-8" />
              <h2 className="text-2xl font-bold">Pixiv涩图</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              精选优质二次元插画，支持多种筛选和标签搜索。每日更新海量作品，
              包含全年龄和 R18 内容分级，让您尽情探索二次元的魅力。
            </p>
            <Link
              href="/features"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r 
                from-pink-500 to-rose-500 text-white rounded-xl 
                hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg 
                hover:shadow-xl"
            >
              <SparklesIcon className="h-5 w-5" />
              <span>立即体验</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        {/* 其他功能网格 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.slice(1).map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (index + 3) }}
                className="relative group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`
                    w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color}
                    flex items-center justify-center mb-4
                  `}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
                <div className={`
                  absolute -inset-0.5 bg-gradient-to-br ${feature.color} rounded-xl
                  opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20
                  transition-opacity -z-10
                `} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
