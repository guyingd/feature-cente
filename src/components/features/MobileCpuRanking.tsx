'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowPathIcon, 
  ChevronUpIcon,
  DevicePhoneMobileIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface CpuData {
  top: number;
  model: string;
}

interface RankingResponse {
  code: number;
  count: string;
  update: string;
  data: CpuData[];
  api_source: string;
}

// 获取芯片品牌
const getChipBrand = (model: string): string => {
  if (model.includes('骁龙')) return 'Qualcomm';
  if (model.includes('天玑')) return 'MediaTek';
  if (model.includes('麒麟')) return 'HiSilicon';
  if (model.includes('Exynos')) return 'Samsung';
  if (model.startsWith('A') && model.match(/\d/)) return 'Apple';
  if (model.includes('T') && model.match(/\d/)) return 'UNISOC';
  if (model.includes('Helio')) return 'MediaTek';
  return 'Other';
};

// 获取品牌颜色
const getBrandColor = (brand: string): string => {
  const colors: Record<string, string> = {
    Qualcomm: 'from-red-500 to-orange-500',
    MediaTek: 'from-blue-500 to-cyan-500',
    HiSilicon: 'from-purple-500 to-pink-500',
    Samsung: 'from-blue-600 to-blue-400',
    Apple: 'from-gray-600 to-gray-400',
    UNISOC: 'from-green-500 to-emerald-500',
    Other: 'from-gray-500 to-gray-400'
  };
  return colors[brand] || colors.Other;
};

export default function MobileCpuRanking() {
  const [data, setData] = useState<CpuData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [updateTime, setUpdateTime] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');

  // 获取数据
  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('https://api.pearktrue.cn/api/tianti/sjcpu.php');
      
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
  const filteredData = data.filter(cpu => {
    const matchesSearch = cpu.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrand === 'all' || getChipBrand(cpu.model) === selectedBrand;
    return matchesSearch && matchesBrand;
  });

  // 获取所有品牌
  const brands = ['all', ...new Set(data.map(cpu => getChipBrand(cpu.model)))];

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
                手机处理器天梯榜
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

          {/* 品牌筛选 */}
          <div className="flex flex-wrap gap-2">
            {brands.map((brand) => (
              <motion.button
                key={brand}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedBrand(brand)}
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                  ${selectedBrand === brand
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }
                `}
              >
                {brand === 'all' ? '全部' : brand}
              </motion.button>
            ))}
          </div>

          {/* 搜索框 */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索处理器型号..."
              className="w-full px-4 py-3 pl-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl
                focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent
                placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* CPU列表 */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[400px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <DevicePhoneMobileIcon className="h-12 w-12 text-purple-500" />
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
              {filteredData.map((cpu) => {
                const brand = getChipBrand(cpu.model);
                const brandColor = getBrandColor(brand);
                
                return (
                  <motion.div
                    key={cpu.top}
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
                      ${cpu.top <= 3 
                        ? `bg-gradient-to-br ${brandColor} text-white` 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }
                    `}>
                      {cpu.top}
                    </div>

                    {/* CPU信息 */}
                    <div className="flex items-center gap-3">
                      <div className={`
                        p-2 rounded-lg bg-gradient-to-br ${brandColor} bg-opacity-10 dark:bg-opacity-20
                      `}>
                        <DevicePhoneMobileIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {cpu.model}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {brand}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
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