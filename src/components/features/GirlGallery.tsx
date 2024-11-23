'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowPathIcon, ExclamationCircleIcon, KeyIcon, ClockIcon } from '@heroicons/react/24/outline';

interface ApiResponse {
  code: number;
  msg: string;
  data: string;
}

export default function GirlGallery() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const [lastFetchTime, setLastFetchTime] = useState(0);

  const fetchSingleImage = async (retryCount = 0): Promise<string> => {
    try {
      const response = await fetch('https://v2.api-m.com/api/heisi');
      
      if (response.status === 429) {
        // 如果遇到请求限制，等待一段时间后重试
        if (retryCount < 3) {
          await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 2000));
          return fetchSingleImage(retryCount + 1);
        } else {
          throw new Error('请求过于频繁，请稍后再试');
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      if (data.code === 200 && data.data) {
        return data.data;
      }
      throw new Error(data.msg || '获取图片失败');
    } catch (err) {
      if (err instanceof Error && err.message.includes('429')) {
        throw new Error('请求过于频繁，请稍后再试');
      }
      throw err;
    }
  };

  const fetchImages = useCallback(async () => {
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTime;
    
    // 增加冷却时间到5秒
    if (timeSinceLastFetch < 5000) {
      const remainingTime = Math.ceil((5000 - timeSinceLastFetch) / 1000);
      setCooldown(remainingTime);
      return;
    }

    try {
      setLoading(true);
      setError('');
      setLastFetchTime(now);
      
      // 分批请求图片，每批3张，间隔1秒
      const batchSize = 3;
      const batches = Math.ceil(10 / batchSize);
      const allImages: string[] = [];

      for (let i = 0; i < batches; i++) {
        const batchPromises = Array(Math.min(batchSize, 10 - i * batchSize))
          .fill(null)
          .map(() => fetchSingleImage());

        const batchImages = await Promise.all(batchPromises);
        allImages.push(...batchImages);

        if (i < batches - 1) {
          // 批次之间等待1秒
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      setImages(allImages);
      setRetryCount(0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取图片时出错';
      console.error('Error fetching images:', err);
      
      let detailedError = errorMessage;
      if (errorMessage.includes('429') || errorMessage.includes('频繁')) {
        detailedError = `
          请求过于频繁
          请等待一段时间后再试
          
          建议：
          1. 减少请求频率
          2. 等待几分钟后重试
          3. 使用缓存的图片
        `;
      }
      
      setError(detailedError);
      
      if (retryCount < 3 && !errorMessage.includes('频繁')) {
        setRetryCount(prev => prev + 1);
        setTimeout(fetchImages, 3000);
      }
    } finally {
      setLoading(false);
    }
  }, [retryCount, lastFetchTime]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.code === 'Enter') {
        event.preventDefault();
        if (cooldown === 0) {
          fetchImages();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [fetchImages, cooldown]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return (
    <div className="p-4 sm:p-6 pt-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={loading ? 'loading' : error ? 'error' : 'gallery'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
            >
              <KeyIcon className="h-4 w-4" />
              <span>按空格键或回车键可快速换图</span>
            </motion.div>
            <motion.button
              whileHover={{ scale: cooldown === 0 ? 1.05 : 1 }}
              whileTap={{ scale: cooldown === 0 ? 0.95 : 1 }}
              onClick={() => cooldown === 0 && fetchImages()}
              disabled={cooldown > 0}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${
                cooldown > 0
                  ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 shadow-lg hover:shadow-xl'
              } text-white`}
            >
              {cooldown > 0 ? (
                <>
                  <ClockIcon className="h-5 w-5" />
                  <span>{cooldown}秒后可用</span>
                </>
              ) : (
                <>
                  <ArrowPathIcon className="h-5 w-5" />
                  <span>换一批</span>
                </>
              )}
            </motion.button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-[300px] sm:h-[400px] bg-gray-100 dark:bg-gray-700 rounded-xl">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                正在加载图片{retryCount > 0 ? ` (重试 ${retryCount}/3)` : ''}...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-[300px] sm:h-[400px] bg-gray-100 dark:bg-gray-700 rounded-xl p-4 sm:p-6">
              <ExclamationCircleIcon className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-red-500 mb-4 text-center max-w-md">{error}</p>
              <button
                onClick={() => {
                  setRetryCount(0);
                  fetchImages();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
              >
                <ArrowPathIcon className="h-5 w-5" />
                重新加载
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {images.map((imageUrl, index) => (
                <motion.div
                  key={imageUrl + index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img
                      src={imageUrl}
                      alt={`美女图片 ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://placehold.co/600x800?text=加载失败';
                      }}
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => window.open(imageUrl, '_blank')}
                    className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
                    title="查看原图"
                  >
                    <ArrowPathIcon className="h-5 w-5" />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 