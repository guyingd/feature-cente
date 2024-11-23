'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowPathIcon, 
  ChevronUpIcon,
  ComputerDesktopIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface GpuData {
  top: number;
  model: string;
}

interface RankingResponse {
  code: number;
  count: string;
  update: string;
  data: GpuData[];
  api_source: string;
}

export default function GpuRanking() {
  const [data, setData] = useState<GpuData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [updateTime, setUpdateTime] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // 获取数据
  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('https://api.pearktrue.cn/api/tianti/zmxk.php');
      
      if (!response.ok) {
        throw new Error('获取数据失败');
      }

      const result: RankingResponse = await response.json();

      if (result.code === 200) {
        setData(result.data);
        setUpdateTime(result.update);
      } else {
        throw new Error('数据格式错误');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('获取数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 监听滚动
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 初始加载
  useEffect(() => {
    fetchData();
  }, []);

  // 过滤数据
  const filteredData = data.filter(gpu => 
    gpu.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 回到顶部
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-4 sm:p-6 pt-0">
      <div className="max-w-4xl mx-auto">
        {/* 标题和搜索栏 */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                显卡天梯榜
              </h2>
              {updateTime && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  更新时间：{updateTime}
                </p>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchData}
              className="p-2 text-gray-500 hover:text-purple-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="刷新数据"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </motion.button>
          </div>

          {/* 搜索框 */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索显卡型号..."
              className="w-full px-4 py-3 pl-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl
                focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent
                placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* 显卡列表 */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[400px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <ComputerDesktopIcon className="h-12 w-12 text-purple-500" />
            </motion.div>
            <p className="mt-4 text-gray-500 dark:text-gray-400">加载中...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-red-500">
            <ExclamationCircleIcon className="h-12 w-12 mb-4" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredData.map((gpu) => (
                <motion.div
                  key={gpu.top}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="relative bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm
                    hover:shadow-md transition-shadow duration-300
                    border border-gray-200 dark:border-gray-700"
                >
                  {/* 排名标签 */}
                  <div className={`
                    absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                    ${gpu.top <= 3 ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}
                  `}>
                    {gpu.top}
                  </div>

                  {/* 显卡信息 */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <ComputerDesktopIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {gpu.model}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        排名：{gpu.top}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* 回到顶部按钮 */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 p-3 bg-purple-500 text-white rounded-full shadow-lg
                hover:bg-purple-600 transition-colors z-50"
            >
              <ChevronUpIcon className="h-6 w-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 