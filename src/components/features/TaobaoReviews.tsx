'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowPathIcon,
  PhotoIcon,
  ExclamationCircleIcon,
  ArrowsPointingOutIcon
} from '@heroicons/react/24/outline';

interface ImageResponse {
  code: string;
  imgurl: string;
  api_source: string;
}

export default function TaobaoReviews() {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);

  // 获取图片
  const fetchImage = async () => {
    try {
      setLoading(true);
      setError('');
      setIsZoomed(false);

      const response = await fetch('https://api.pearktrue.cn/api/taobao/img.php');
      
      if (!response.ok) {
        throw new Error('获取图片失败');
      }

      const data: ImageResponse = await response.json();

      if (data.code === '200' && data.imgurl) {
        setImageUrl(data.imgurl);
      } else {
        throw new Error('获取图片失败');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : '获取图片失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchImage();
  }, []);

  return (
    <div className="p-4 sm:p-6 pt-0">
      <div className="max-w-2xl mx-auto">
        {/* 标题和刷新按钮 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            淘宝买家秀
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchImage}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-purple-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 
              transition-colors disabled:opacity-50"
            title="换一张"
          >
            <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>

        {/* 图片展示区域 */}
        <div className="relative bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center aspect-[4/3] w-full"
              >
                <PhotoIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 animate-pulse" />
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center aspect-[4/3] w-full text-red-500"
              >
                <ExclamationCircleIcon className="h-12 w-12 mb-2" />
                <p>{error}</p>
              </motion.div>
            ) : imageUrl ? (
              <motion.div
                key="image"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative group"
              >
                {/* 图片容器 */}
                <div 
                  className={`
                    relative cursor-pointer transition-transform duration-300
                    ${isZoomed ? 'fixed inset-0 z-50 bg-black/90 p-4' : ''}
                  `}
                  onClick={() => setIsZoomed(!isZoomed)}
                >
                  <img
                    src={imageUrl}
                    alt="淘宝买家秀"
                    className={`
                      w-full object-contain mx-auto
                      ${isZoomed ? 'h-full' : 'aspect-[4/3]'}
                    `}
                    onError={() => setError('图片加载失败')}
                  />
                </div>

                {/* 放大按钮 */}
                {!isZoomed && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-lg 
                      backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setIsZoomed(true)}
                  >
                    <ArrowsPointingOutIcon className="h-5 w-5" />
                  </motion.button>
                )}

                {/* 关闭按钮 */}
                {isZoomed && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed top-4 right-4 p-2 bg-white/10 text-white rounded-lg 
                      backdrop-blur-sm hover:bg-white/20 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsZoomed(false);
                    }}
                  >
                    <ArrowsPointingOutIcon className="h-5 w-5" />
                  </motion.button>
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* 换一张按钮 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchImage}
            disabled={loading}
            className="w-full mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg 
              hover:bg-purple-600 transition-colors disabled:opacity-50
              flex items-center justify-center gap-2"
          >
            <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            <span>换一张</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
} 