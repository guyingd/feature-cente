'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowPathIcon, 
  ExclamationCircleIcon,
  ArrowsRightLeftIcon,
  PhotoIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

type PlatformType = 'baidu' | 'weibo';

const PLATFORMS = [
  { label: '百度热搜', value: 'baidu' },
  { label: '微博热搜', value: 'weibo' },
];

export default function HotNews() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [platform, setPlatform] = useState<PlatformType>('baidu');
  const [imageKey, setImageKey] = useState(Date.now()); // 用于强制刷新图片

  const getImageUrl = (type: PlatformType) => {
    return `https://api.pearktrue.cn/api/60s/image/hot/?type=${type}&t=${Date.now()}`;
  };

  const refreshImage = useCallback(() => {
    setLoading(true);
    setError('');
    setImageKey(Date.now());
    
    // 模拟加载时间
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleImageError = () => {
    setError('热榜图片加载失败，请稍后重试');
  };

  return (
    <div className="p-4 sm:p-6 pt-0">
      <div className="flex flex-col space-y-4">
        {/* 控制栏 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {PLATFORMS.map(p => (
                <motion.button
                  key={p.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setPlatform(p.value as PlatformType);
                    refreshImage();
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                    platform === p.value
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <ArrowsRightLeftIcon className="h-4 w-4" />
                  <span>{p.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
          <motion.button
            whileHover={{ scale: !loading ? 1.05 : 1 }}
            whileTap={{ scale: !loading ? 0.95 : 1 }}
            onClick={refreshImage}
            disabled={loading}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${
              loading
                ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {loading ? (
              <ArrowPathIcon className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <ArrowPathIcon className="h-5 w-5" />
                <span>刷新热榜</span>
              </>
            )}
          </motion.button>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <ExclamationCircleIcon className="h-5 w-5" />
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* 图片展示 */}
        {!error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg"
          >
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-[600px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">加载中...</p>
                  </div>
                ) : (
                  <img
                    key={imageKey} // 使用key强制刷新图片
                    src={getImageUrl(platform)}
                    alt={`${platform === 'baidu' ? '百度' : '微博'}热搜榜`}
                    className="w-full h-auto object-contain"
                    loading="lazy"
                    onError={handleImageError}
                  />
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => window.open(getImageUrl(platform), '_blank')}
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                  title="查看原图"
                >
                  <PhotoIcon className="h-5 w-5" />
                </motion.button>
              </div>
              <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                {platform === 'baidu' ? '百度' : '微博'}热搜榜 - 更新时间: {new Date().toLocaleString()}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 