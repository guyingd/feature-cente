'use client';

import { motion } from 'framer-motion';
import {
  ChartPieIcon,
  CloudArrowUpIcon,
  DocumentTextIcon,
  CogIcon,
  PhotoIcon,
  CommandLineIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    name: '数据分析',
    description: '强大的数据分析工具，帮助您洞察关键指标',
    icon: ChartPieIcon,
    href: '/features/analytics',
    color: 'from-purple-500 to-indigo-500',
  },
  {
    name: '文件处理',
    description: '便捷的文件上传、转换和处理功能',
    icon: CloudArrowUpIcon,
    href: '/features/files',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    name: '文本工具',
    description: '多样的文本处理和转换工具集',
    icon: DocumentTextIcon,
    href: '/features/text',
    color: 'from-green-500 to-emerald-500',
  },
  {
    name: '系统工具',
    description: '实用的系统维护和优化工具',
    icon: CogIcon,
    href: '/features/system',
    color: 'from-orange-500 to-red-500',
  },
  {
    name: '图像处理',
    description: '专业的图像编辑和优化功能',
    icon: PhotoIcon,
    href: '/features/image',
    color: 'from-pink-500 to-rose-500',
  },
  {
    name: '开发工具',
    description: '便捷的开发辅助工具集合',
    icon: CommandLineIcon,
    href: '/features/dev',
    color: 'from-yellow-500 to-orange-500',
  },
];

export default function FeatureCards() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            功能特性
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            探索我们提供的丰富功能，助力您的工作效率
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
          <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5 rounded-2xl`} />
                <div className="relative">
                  <feature.icon
                    className={`h-12 w-12 bg-gradient-to-br ${feature.color} p-2 rounded-lg text-white`}
                    aria-hidden="true"
                  />
                  <h3 className="mt-6 text-lg font-semibold leading-8 text-gray-900 dark:text-white">
                    {feature.name}
                  </h3>
                  <p className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                  <a
                    href={feature.href}
                    className="mt-4 inline-flex items-center text-sm font-semibold text-purple-600 dark:text-purple-400"
                  >
                    了解更多
                    <span aria-hidden="true" className="ml-1">→</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 