'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowPathIcon, 
  ExclamationCircleIcon,
  PhotoIcon,
  MagnifyingGlassIcon,
  LinkIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface XhsResponse {
  code: number;
  msg: string;
  url: string;
  data: {
    desc: string;
    img_lists: string[];
  };
  api_source: string;
}

export default function XhsParser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<XhsResponse | null>(null);
  const [url, setUrl] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const parseUrl = useCallback(async () => {
    if (!url.trim() || loading) return;

    try {
      setLoading(true);
      setError('');
      
      const queryParams = new URLSearchParams({
        url: url.trim()
      });

      const response = await fetch(`https://api.pearktrue.cn/api/xhhimg/?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: XhsResponse = await response.json();
      console.log('API Response:', data);
      
      if (data.code === 200) {
        if (!data.data.img_lists || data.data.img_lists.length === 0) {
          throw new Error('未找到图片');
        }
        setResult(data);
      } else {
        throw new Error(data.msg || '解析失败');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '解析时出错';
      console.error('Parse error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [url]);

  return (
    <div className="p-4 sm:p-6 pt-0">
      <div className="flex flex-col space-y-4">
        {/* 输入区域 */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="请输入小红书笔记链接..."
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <motion.button
            whileHover={{ scale: !loading ? 1.05 : 1 }}
            whileTap={{ scale: !loading ? 0.95 : 1 }}
            onClick={parseUrl}
            disabled={loading || !url.trim()}
            className={`sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl transition-all ${
              loading || !url.trim()
                ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {loading ? (
              <ArrowPathIcon className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <MagnifyingGlassIcon className="h-5 w-5" />
                <span>解析图集</span>
              </>
            )}
          </motion.button>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <ExclamationCircleIcon className="h-5 w-5" />
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* 结果展示 */}
        {result && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg"
          >
            <div className="space-y-4">
              {/* 笔记信息 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <LinkIcon className="h-4 w-4 flex-shrink-0" />
                  <a 
                    href={result.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-purple-600 dark:hover:text-purple-400 truncate"
                  >
                    {result.url}
                  </a>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {result.data.desc}
                </p>
              </div>

              {/* 图片网格 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {result.data.img_lists.map((imageUrl, index) => (
                  <motion.div
                    key={imageUrl + index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative group cursor-pointer"
                    onClick={() => setSelectedImage(imageUrl)}
                  >
                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img
                        src={imageUrl}
                        alt={`图片 ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://placehold.co/600x600?text=加载失败';
                          console.error('Image load error:', imageUrl);
                        }}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                        <PhotoIcon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* 空状态提示 */}
        {!result && !error && !loading && (
          <div className="flex flex-col items-center justify-center h-[400px] bg-gray-100 dark:bg-gray-700 rounded-xl">
            <LinkIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              输入小红书笔记链接开始解析
            </p>
          </div>
        )}

        {/* 图片预览模态框 */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedImage}
                  alt="预览图片"
                  className="max-w-full max-h-[90vh] object-contain rounded-lg"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
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