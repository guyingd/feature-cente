'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import VideoPlayer from '@/components/features/VideoPlayer';
import GirlGallery from '@/components/features/GirlGallery';
import WhiteStockings from '@/components/features/WhiteStockings';
import AiChat from '@/components/features/AiChat';
import AiDraw from '@/components/features/AiDraw';
import HotNews from '@/components/features/HotNews';
import RandomMusic from '@/components/features/RandomMusic';
import XhsParser from '@/components/features/XhsParser';
import LolHero from '@/components/features/LolHero';
import { SystemMonitor } from '@/components/ui';
import HardwareRanking from '@/components/features/HardwareRanking';
import HuluxiaSearch from '@/components/features/HuluxiaSearch';
import TaobaoReviews from '@/components/features/TaobaoReviews';
import AnimeGallery from '@/components/features/AnimeGallery';

const categories = [
  { name: 'Pixiv涩图', component: <AnimeGallery />, description: '精选优质二次元插画，支持多种筛选，标签搜索' },
  { name: '硬件排行', component: <HardwareRanking />, description: '全网最新的CPU、GPU和手机处理器性能排行榜' },
  { name: 'AI 助手', component: <AiChat />, description: '智能AI助手，为您解答各种问题' },
  { name: '视频播放', component: <VideoPlayer />, description: '精选短视频，随机播放' },
  { name: '买家秀', component: <TaobaoReviews />, description: '随机淘宝买家秀图片，让您捧腹大笑' },
  { name: '应用搜索', component: <HuluxiaSearch />, description: '海量应用资源，一键搜索下载' },
  { name: '随机音乐', component: <RandomMusic />, description: '随机播放热门音乐' },
  { name: '热点新闻', component: <HotNews />, description: '实时热点新闻聚合' },
];

export default function FeaturesPage() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].name);

  return (
    <div className="min-h-screen py-20">
      {/* 系统状态监控 */}
      <SystemMonitor />

      {/* 页面标题 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
            功能中心
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300">
            探索我们提供的各种实用功能
          </p>
        </motion.div>
      </div>

      {/* 分类标签 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
                selectedCategory === category.name
                  ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* 功能区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {selectedCategory}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
              {categories.find(c => c.name === selectedCategory)?.description}
            </p>
          </div>
          {categories.find((category) => category.name === selectedCategory)?.component}
        </motion.div>
      </div>
    </div>
  );
} 