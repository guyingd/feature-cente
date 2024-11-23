'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  ExclamationCircleIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  TagIcon,
  CubeIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface AppData {
  apptitle: string;
  packname: string;
  size: string;
  version: string;
  category: string;
  applogo: string;
  downloadurl: string;
}

interface SearchResponse {
  code: number;
  msg: string;
  count: number;
  data: AppData[];
  api_source: string;
}

export default function HuluxiaSearch() {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<AppData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // 添加默认图标
  const defaultAppIcon = '/app-icon-placeholder.png'; // 添加一个默认的应用图标

  // 图片加载错误处理
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = defaultAppIcon;
    e.currentTarget.onerror = null; // 防止循环加载
  };

  // 执行搜索
  const performSearch = async (searchKeyword: string, pageNum: number) => {
    if (!searchKeyword.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        `https://api.pearktrue.cn/api/huluxia/search.php?keyword=${encodeURIComponent(searchKeyword)}&page=${pageNum}`
      );

      if (!response.ok) {
        throw new Error('搜索失败');
      }

      const data: SearchResponse = await response.json();

      if (data.code === 200) {
        if (pageNum === 1) {
          setSearchResults(data.data);
        } else {
          setSearchResults(prev => [...prev, ...data.data]);
        }
        setHasMore(data.data.length === 20); // 假设每页20条数据
      } else {
        throw new Error(data.msg || '搜索失败');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : '搜索失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理搜索输入
  const handleSearch = (value: string) => {
    setKeyword(value);
    setPage(1);
    setHasMore(true);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(value, 1);
    }, 500);
  };

  // 加载更多
  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      performSearch(keyword, nextPage);
    }
  };

  // 清理
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="p-4 sm:p-6 pt-0">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 搜索框 */}
        <div className="relative">
          <input
            type="text"
            value={keyword}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="搜索应用..."
            className="w-full px-4 py-3 pl-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl
              focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent
              placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>

        {/* 搜索结果 */}
        <div className="space-y-4">
          {loading && page === 1 ? (
            <div className="flex flex-col items-center justify-center h-[400px]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <CubeIcon className="h-12 w-12 text-purple-500" />
              </motion.div>
              <p className="mt-4 text-gray-500 dark:text-gray-400">搜索中...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-red-500">
              <ExclamationCircleIcon className="h-12 w-12 mb-4" />
              <p>{error}</p>
            </div>
          ) : searchResults.length > 0 ? (
            <>
              <AnimatePresence mode="popLayout">
                {searchResults.map((app, index) => (
                  <motion.div
                    key={`${app.packname}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300
                      border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start gap-4">
                      {/* 应用图标容器 */}
                      <div className="relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                        {/* 图标骨架屏 */}
                        <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-600" />
                        
                        {/* 应用图标 */}
                        <img
                          src={app.applogo}
                          alt={app.apptitle}
                          onError={handleImageError}
                          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                          loading="lazy"
                          style={{
                            opacity: app.applogo ? 1 : 0,
                          }}
                        />
                      </div>

                      {/* 应用信息 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate pr-4">
                            {app.apptitle}
                          </h3>
                          
                          {/* 下载按钮 */}
                          <a
                            href={app.downloadurl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 group"
                          >
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 text-purple-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 
                                rounded-lg transition-all duration-300 group-hover:shadow-lg"
                            >
                              <ArrowDownTrayIcon className="h-6 w-6" />
                            </motion.button>
                          </a>
                        </div>

                        <div className="mt-1 space-y-1.5">
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            包名：{app.packname}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs
                              bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                              <TagIcon className="h-3.5 w-3.5 mr-1" />
                              {app.category}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs
                              bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                              版本 {app.version}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs
                              bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                              {app.size}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* 加载更多 */}
              {hasMore && (
                <div className="flex justify-center pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={loadMore}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <ArrowPathIcon className="h-5 w-5 animate-spin" />
                    ) : (
                      <ChevronRightIcon className="h-5 w-5" />
                    )}
                    <span>加载更多</span>
                  </motion.button>
                </div>
              )}
            </>
          ) : keyword && !loading ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-gray-500 dark:text-gray-400">
              <CubeIcon className="h-12 w-12 mb-4" />
              <p>未找到相关应用</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
} 