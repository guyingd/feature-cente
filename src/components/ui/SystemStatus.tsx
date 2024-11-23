'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ServerIcon, 
  CpuChipIcon, 
  CircleStackIcon,
  SignalIcon
} from '@heroicons/react/24/outline';

interface SystemMetricsResponse {
  code: number;
  data: {
    cpuUsage: number;
    memoryUsage: number;
    uptime: number;
    requestCount: number;
    systemInfo: {
      platform: string;
      arch: string;
      version: string;
      totalMemory: string;
      freeMemory: string;
      cpuCores: number;
    };
  };
}

export function SystemStatus() {
  const [mounted, setMounted] = useState(false);
  const [metrics, setMetrics] = useState<SystemMetricsResponse>({
    code: 0,
    data: {
      cpuUsage: 0,
      memoryUsage: 0,
      uptime: 0,
      requestCount: 0,
      systemInfo: {
        platform: '',
        arch: '',
        version: '',
        totalMemory: '',
        freeMemory: '',
        cpuCores: 0
      }
    }
  });

  useEffect(() => {
    setMounted(true);
    fetchSystemMetrics();
  }, []);

  const fetchSystemMetrics = async () => {
    try {
      const response = await fetch('/api/system/status');
      const data: SystemMetricsResponse = await response.json();
      
      if (data.code === 200) {
        setMetrics({
          code: data.code,
          data: {
            cpuUsage: data.data.cpuUsage,
            memoryUsage: data.data.memoryUsage,
            uptime: data.data.uptime,
            requestCount: data.data.requestCount,
            systemInfo: data.data.systemInfo
          }
        });
      } else {
        throw new Error('Failed to get system status');
      }
    } catch (error) {
      console.error('Failed to fetch system metrics:', error);
    }
  };

  useEffect(() => {
    if (mounted) {
      const interval = setInterval(fetchSystemMetrics, 5000);
      return () => clearInterval(interval);
    }
  }, [mounted]);

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}天 ${hours}小时 ${minutes}分钟`;
  };

  if (!mounted) return null;

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* CPU使用率 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <CpuChipIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">CPU</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {metrics.data.cpuUsage.toFixed(1)}%
            </p>
          </div>
        </div>
        <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-600 dark:bg-blue-400 rounded-full"
            animate={{ width: `${metrics.data.cpuUsage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* 内存使用率 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <CircleStackIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">内存</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {metrics.data.memoryUsage.toFixed(1)}%
            </p>
          </div>
        </div>
        <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-green-600 dark:bg-green-400 rounded-full"
            animate={{ width: `${metrics.data.memoryUsage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* 运行时间 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <ServerIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">运行时间</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatUptime(metrics.data.uptime)}
            </p>
          </div>
        </div>
      </div>

      {/* 请求统计 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
            <SignalIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">总请求数</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {metrics.data.requestCount.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 