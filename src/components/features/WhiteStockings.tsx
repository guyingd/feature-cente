'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowPathIcon, 
  ExclamationCircleIcon,
  ArrowsPointingOutIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface ImageData {
  pid: number;
  p: number;
  uid: number;
  title: string;
  author: string;
  r18: boolean;
  width: number;
  height: number;
  tags: string[];
  ext: string;
  aiType: number;
  uploadDate: number;
  urls: {
    original?: string;
    regular?: string;
    small?: string;
    thumb?: string;
    mini?: string;
  };
}

interface ApiResponse {
  error: string;
  data: ImageData[];
}

export default function WhiteStockings() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);

  // 获取图片
  const fetchImages = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/anime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          r18: 0,
          num: 8,
          size: ['regular', 'small'],
          tag: ['白丝'],
          excludeAI: true
        })
      });

      if (!response.ok) {
        throw new Error('获取图片失败');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setImages(data.data);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : '获取图片失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="p-4 sm:p-6 pt-0">
      <div className="max-w-6xl mx-auto">
        {/* 标题和刷新按钮 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            白丝图片
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchImages}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-purple-500 rounded-lg hover:bg-gray-100 
              dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            title="换一批"
          >
            <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>

        {/* 图片网格 */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-red-500">
            <ExclamationCircleIcon className="h-12 w-12 mb-4" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {images.map((image) => (
                <motion.div
                  key={`${image.pid}-${image.p}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="group relative aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image.urls.small}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white text-sm font-medium truncate">
                        {image.title}
                      </h3>
                      <p className="text-white/80 text-xs truncate">
                        {image.author}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* 图片预览弹窗 */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-4xl w-full"
                onClick={e => e.stopPropagation()}
              >
                <img
                  src={selectedImage.urls.regular}
                  alt={selectedImage.title}
                  className="w-full h-auto rounded-lg"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-lg 
                    hover:bg-black/70 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 