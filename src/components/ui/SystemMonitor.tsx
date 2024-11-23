'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChartBarIcon, 
  CpuChipIcon,
  ChevronLeftIcon,
  CircleStackIcon,
  ServerIcon,
  SignalIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

// 将格式化函数移到组件外部
const formatUptime = (seconds: number) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}天`);
  if (hours > 0) parts.push(`${hours}小时`);
  if (minutes > 0) parts.push(`${minutes}分钟`);
  if (secs > 0) parts.push(`${secs}秒`);

  return parts.join(' ') || '刚刚启动';
};

export function SystemMonitor() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'system' | 'api'>('system');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [metrics, setMetrics] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    uptime: 0,
    requestCount: 0,
    timestamp: Date.now()
  });
  const [endpoints, setEndpoints] = useState([
    {
      name: '视频API',
      url: 'https://api.example.com/video',
      status: 'operational',
      responseTime: 0,
      lastChecked: ''
    },
    {
      name: '图片API',
      url: 'https://api.example.com/image',
      status: 'operational',
      responseTime: 0,
      lastChecked: ''
    },
    {
      name: 'AI API',
      url: 'https://api.example.com/ai',
      status: 'operational',
      responseTime: 0,
      lastChecked: ''
    }
  ]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [startTime] = useState(Date.now());
  const [uptimeString, setUptimeString] = useState('');

  // 计算运行时间
  const calculateUptime = useCallback(() => {
    const uptime = Math.floor((Date.now() - startTime) / 1000);
    return formatUptime(uptime);
  }, [startTime]);

  // 初始化和更新运行时间
  useEffect(() => {
    setUptimeString(calculateUptime());
    const timer = setInterval(() => {
      setUptimeString(calculateUptime());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateUptime]);

  // 定义获取系统数据的函数
  const fetchSystemMetrics = useCallback(async () => {
    try {
      const [statusResponse, counterResponse] = await Promise.all([
        fetch('/api/system/status', { cache: 'no-store' }),
        fetch('/api/request-counter', { cache: 'no-store' })
      ]);

      const [statusData, counterData] = await Promise.all([
        statusResponse.json(),
        counterResponse.json()
      ]);

      if (statusData.code === 200) {
        setMetrics({
          ...statusData.data,
          requestCount: counterData.count || 0,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.error('Failed to fetch system metrics:', error);
      setMetrics(prev => ({
        ...prev,
        timestamp: Date.now()
      }));
    }
  }, []);

  // 定义更新API状态的函数
  const updateEndpoints = useCallback(() => {
    setEndpoints(prev => prev.map(endpoint => ({
      ...endpoint,
      status: Math.random() > 0.9 ? 'degraded' : 'operational',
      responseTime: Math.random() * 1000,
      lastChecked: new Date().toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
    })));
  }, []);

  // 初始化
  useEffect(() => {
    setMounted(true);
    fetchSystemMetrics();
    updateEndpoints();
  }, [fetchSystemMetrics, updateEndpoints]);

  // 定时更新数据
  useEffect(() => {
    if (mounted) {
      const systemInterval = setInterval(fetchSystemMetrics, 5000);
      const apiInterval = setInterval(updateEndpoints, 5000);
      
      return () => {
        clearInterval(systemInterval);
        clearInterval(apiInterval);
      };
    }
  }, [mounted, fetchSystemMetrics, updateEndpoints]);

  // 处理展开/收起
  const handleToggleExpand = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (!isAnimating) {
      setIsAnimating(true);
      setIsExpanded(prev => !prev);
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [isAnimating]);

  if (!mounted) return null;

  return (
    <div className="fixed right-0 top-24 z-50 print:hidden">
      <motion.div
        ref={containerRef}
        animate={{
          x: isExpanded ? 0 : 'calc(100% - 40px)',
          transition: {
            type: 'spring',
            damping: 20,
            stiffness: 300
          }
        }}
        className="relative"
        style={{
          width: 'min(320px, calc(100vw - 32px))',
        }}
      >
        <div className={`
          bg-white dark:bg-gray-800 
          shadow-lg overflow-hidden
          transition-all duration-300 ease-in-out
          border-l border-t border-b border-gray-200 dark:border-gray-700
          rounded-l-xl
          backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95
          ${isExpanded ? 'shadow-xl' : 'shadow-md hover:shadow-lg'}
        `}>
          <div 
            className={`
              flex items-center justify-between p-3
              bg-gray-50/90 dark:bg-gray-700/90
              cursor-pointer
              hover:bg-gray-100/90 dark:hover:bg-gray-600/90
              transition-colors duration-200
              ${!isExpanded && 'hover:pl-6'}
              border-b border-gray-200/50 dark:border-gray-600/50
            `}
            onClick={handleToggleExpand}
          >
            <div className="flex items-center gap-2">
              <div className={`
                p-1.5 rounded-lg
                ${isExpanded 
                  ? 'bg-purple-100/50 dark:bg-purple-900/50' 
                  : 'bg-purple-100 dark:bg-purple-900'
                }
                transition-colors duration-300
              `}>
                <ChartBarIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span className={`
                text-sm font-medium text-gray-900 dark:text-white
                transition-all duration-300
                ${isExpanded ? 'opacity-100' : 'opacity-0'}
              `}>
                系统监控
              </span>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 0 : 180 }}
              transition={{ duration: 0.3 }}
              className={`
                p-1.5 rounded-lg
                hover:bg-gray-200/50 dark:hover:bg-gray-600/50
                transition-colors duration-200
              `}
            >
              <ChevronLeftIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </motion.div>
          </div>

          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="flex border-b border-gray-200/50 dark:border-gray-600/50">
                  {['system', 'api'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as 'system' | 'api')}
                      className={`
                        flex-1 px-3 py-2 text-xs sm:text-sm font-medium
                        transition-all duration-200
                        ${activeTab === tab
                          ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 bg-purple-50/50 dark:bg-purple-900/20'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-gray-700/50'
                        }
                      `}
                    >
                      {tab === 'system' ? '系统状态' : 'API状态'}
                    </button>
                  ))}
                </div>

                <div className="p-3 bg-gray-50/30 dark:bg-gray-800/30">
                  <AnimatePresence mode="wait">
                    {activeTab === 'system' ? (
                      <motion.div
                        key="system"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-2 gap-2"
                      >
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                              <CpuChipIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400">CPU</p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {metrics.cpuUsage.toFixed(1)}%
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-blue-600 dark:bg-blue-400 rounded-full"
                              animate={{ width: `${metrics.cpuUsage}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                              <CircleStackIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400">内存</p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {metrics.memoryUsage.toFixed(1)}%
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-green-600 dark:bg-green-400 rounded-full"
                              animate={{ width: `${metrics.memoryUsage}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                              <ServerIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400">运行时间</p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {uptimeString}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            启动于 {new Date(startTime).toLocaleString('zh-CN', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                              hour12: false
                            })}
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                              <SignalIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400">总请求数</p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {metrics.requestCount.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="api"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-2"
                      >
                        {endpoints.map((endpoint, index) => (
                          <div
                            key={endpoint.name}
                            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                {endpoint.name}
                              </h4>
                              <div className={`flex items-center gap-1 ${getStatusColor(endpoint.status)}`}>
                                {getStatusIcon(endpoint.status)}
                                <span className="text-xs capitalize">
                                  {endpoint.status === 'operational' ? '正常' : '异常'}
                                </span>
                              </div>
                            </div>
                            <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                              <p>响应时间: {endpoint.responseTime.toFixed(0)}ms</p>
                              <p>最后检查: {endpoint.lastChecked}</p>
                              <p className="truncate text-xs">{endpoint.url}</p>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="absolute inset-0 -z-10 backdrop-blur-md" />
      </motion.div>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'operational':
      return 'text-green-600 dark:text-green-400';
    case 'degraded':
      return 'text-yellow-600 dark:text-yellow-400';
    default:
      return 'text-red-600 dark:text-red-400';
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'operational':
      return <CheckCircleIcon className="h-4 w-4" />;
    case 'degraded':
      return <ExclamationCircleIcon className="h-4 w-4" />;
    default:
      return <XCircleIcon className="h-4 w-4" />;
  }
} 