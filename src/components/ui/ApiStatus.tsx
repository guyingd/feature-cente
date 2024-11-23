'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface ApiEndpoint {
  name: string;
  url: string;
  status: 'operational' | 'degraded' | 'down';
  responseTime: number;
  lastChecked: string;
}

export function ApiStatus() {
  const [mounted, setMounted] = useState(false);
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([
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

  useEffect(() => {
    setMounted(true);
    // 初始化时间
    updateEndpoints();
  }, []);

  const updateEndpoints = () => {
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
  };

  useEffect(() => {
    if (mounted) {
      const interval = setInterval(updateEndpoints, 5000);
      return () => clearInterval(interval);
    }
  }, [mounted]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-600 dark:text-green-400';
      case 'degraded':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'down':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'degraded':
        return <ExclamationCircleIcon className="h-5 w-5" />;
      case 'down':
        return <ExclamationCircleIcon className="h-5 w-5" />;
      default:
        return <ClockIcon className="h-5 w-5" />;
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {endpoints.map((endpoint, index) => (
          <motion.div
            key={endpoint.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {endpoint.name}
              </h3>
              <div className={`flex items-center gap-2 ${getStatusColor(endpoint.status)}`}>
                {getStatusIcon(endpoint.status)}
                <span className="text-sm capitalize">
                  {endpoint.status}
                </span>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>响应时间: {endpoint.responseTime.toFixed(0)}ms</p>
              <p>最后检查: {endpoint.lastChecked}</p>
              <p className="truncate">{endpoint.url}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center">
        <div className="inline-flex items-center gap-4 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>正常运行</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
            <span>性能下降</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span>服务中断</span>
          </div>
        </div>
      </div>
    </div>
  );
} 