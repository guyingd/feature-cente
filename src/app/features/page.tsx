'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SparklesIcon,
  ComputerDesktopIcon,
  ChatBubbleBottomCenterTextIcon,
  VideoCameraIcon,
  PhotoIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

// 导入所有功能组件
import AnimeGallery from '@/components/features/AnimeGallery';
import HardwareRanking from '@/components/features/HardwareRanking';
import AiChat from '@/components/features/AiChat';
import VideoPlayer from '@/components/features/VideoPlayer';
import TaobaoReviews from '@/components/features/TaobaoReviews';
import HuluxiaSearch from '@/components/features/HuluxiaSearch';

const categories = [
  { 
    name: 'Pixiv涩图', 
    component: <AnimeGallery />, 
    description: '精选优质二次元插画，支持多种筛选，标签搜索',
    icon: SparklesIcon
  },
  { 
    name: '硬件排行', 
    component: <HardwareRanking />, 
    description: '全网最新的CPU、GPU和手机处理器性能排行榜',
    icon: ComputerDesktopIcon
  },
  { 
    name: 'AI 助手', 
    component: <AiChat />, 
    description: '智能AI助手，为您解答各种问题',
    icon: ChatBubbleBottomCenterTextIcon
  },
  { 
    name: '视频播放', 
    component: <VideoPlayer />, 
    description: '精选短视频，随机播放',
    icon: VideoCameraIcon
  },
  { 
    name: '买家秀', 
    component: <TaobaoReviews />, 
    description: '随机淘宝买家秀图片，让您捧腹大笑',
    icon: PhotoIcon
  },
  { 
    name: '应用搜索', 
    component: <HuluxiaSearch />, 
    description: '海量应用资源，一键搜索下载',
    icon: RocketLaunchIcon
  }
];

export default function FeaturesPage() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].name);

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 功能选择器 */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 min-w-max p-1">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={category.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium 
                    transition-colors whitespace-nowrap
                    ${selectedCategory === category.name
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {category.name}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* 功能描述 */}
        <div className="mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedCategory}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {categories.find(c => c.name === selectedCategory)?.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 功能内容 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {categories.find(c => c.name === selectedCategory)?.component}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
} 