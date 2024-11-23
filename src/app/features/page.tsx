'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SparklesIcon,
  ComputerDesktopIcon,
  ChatBubbleBottomCenterTextIcon,
  VideoCameraIcon,
  PhotoIcon,
  RocketLaunchIcon,
  HeartIcon,
  CpuChipIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

// 导入所有功能组件
import AnimeGallery from '@/components/features/AnimeGallery';
import WhiteStockings from '@/components/features/WhiteStockings';
import HardwareRanking from '@/components/features/HardwareRanking';
import AiChat from '@/components/features/AiChat';
import VideoPlayer from '@/components/features/VideoPlayer';
import TaobaoReviews from '@/components/features/TaobaoReviews';
import HuluxiaSearch from '@/components/features/HuluxiaSearch';

// 功能分类
const categories = [
  // 二次元相关
  { 
    name: 'Pixiv涩图', 
    component: <AnimeGallery />, 
    description: '精选优质二次元插画，支持多种筛选，标签搜索',
    icon: SparklesIcon,
    category: '二次元'
  },
  { 
    name: '白丝', 
    component: <WhiteStockings />, 
    description: '白丝图片，支持多种筛选',
    icon: HeartIcon,
    category: '二次元'
  },
  // 硬件相关
  { 
    name: 'CPU天梯榜', 
    component: <HardwareRanking />, 
    description: '全网最新的CPU性能排行榜',
    icon: CpuChipIcon,
    category: '硬件'
  },
  { 
    name: 'GPU天梯榜', 
    component: <HardwareRanking />, 
    description: '全网最新的显卡性能排行榜',
    icon: ComputerDesktopIcon,
    category: '硬件'
  },
  { 
    name: '手机处理器', 
    component: <HardwareRanking />, 
    description: '手机处理器性能排行榜',
    icon: DevicePhoneMobileIcon,
    category: '硬件'
  },
  // AI 相关
  { 
    name: 'AI 助手', 
    component: <AiChat />, 
    description: '智能AI助手，为您解答各种问题',
    icon: ChatBubbleBottomCenterTextIcon,
    category: 'AI'
  },
  // 娱乐相关
  { 
    name: '视频播放', 
    component: <VideoPlayer />, 
    description: '精选短视频，随机播放',
    icon: VideoCameraIcon,
    category: '娱乐'
  },
  { 
    name: '买家秀', 
    component: <TaobaoReviews />, 
    description: '随机淘宝买家秀图片，让您捧腹大笑',
    icon: PhotoIcon,
    category: '娱乐'
  },
  // 工具相关
  { 
    name: '应用搜索', 
    component: <HuluxiaSearch />, 
    description: '海量应用资源，一键搜索下载',
    icon: RocketLaunchIcon,
    category: '工具'
  }
];

// 获取所有分类
const allCategories = ['全部', ...Array.from(new Set(categories.map(item => item.category)))];

export default function FeaturesPage() {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedFeature, setSelectedFeature] = useState(categories[0].name);

  // 过滤功能
  const filteredFeatures = selectedCategory === '全部' 
    ? categories 
    : categories.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 分类选择器 */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 min-w-max p-1">
            {allCategories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedCategory(category);
                  setSelectedFeature(
                    (category === '全部' ? categories : categories.filter(item => item.category === category))[0]?.name
                  );
                }}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium 
                  transition-colors whitespace-nowrap
                  ${selectedCategory === category
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }
                `}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>

        {/* 功能选择器 */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 min-w-max p-1">
            {filteredFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.button
                  key={feature.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedFeature(feature.name)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium 
                    transition-colors whitespace-nowrap
                    ${selectedFeature === feature.name
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {feature.name}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* 功能描述 */}
        <div className="mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedFeature}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedFeature}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {categories.find(c => c.name === selectedFeature)?.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 功能内容 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedFeature}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {categories.find(c => c.name === selectedFeature)?.component}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
} 