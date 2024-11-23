'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ui/ThemeToggle';
import { 
  HomeIcon, 
  SparklesIcon, 
  InformationCircleIcon,
  Bars3Icon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';

const navItems = [
  { name: '首页', href: '/', icon: HomeIcon, title: '功能中心' },
  { name: '功能', href: '/features', icon: SparklesIcon, title: '功能列表' },
  { name: '关于', href: '/about', icon: InformationCircleIcon, title: '关于我们' },
  { 
    name: 'GitHub', 
    href: 'https://github.com/guyingd/feature-cente', 
    icon: CodeBracketIcon, 
    title: '源代码',
    external: true 
  }
];

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const currentPage = navItems.find(item => item.href === pathname) || navItems[0];

  // 更新页面标题
  useEffect(() => {
    document.title = `${currentPage.title} | 功能中心`;
  }, [currentPage.title]);

  // 关闭菜单
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50" />

      <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              href="/"
              className="group flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white"
              onClick={closeMenu}
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500"
              >
                <SparklesIcon className="h-5 w-5 text-white" />
              </motion.div>
              <motion.span
                key={currentPage.title}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400"
              >
                {currentPage.title}
              </motion.span>
            </Link>
          </div>

          {/* 桌面端导航链接 */}
          <div className="hidden sm:flex sm:items-center sm:justify-center">
            <div className="flex space-x-1 p-1.5 bg-gray-100/50 dark:bg-gray-800/50 rounded-xl">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      relative flex items-center gap-2 px-4 py-2 rounded-lg
                      text-sm font-medium transition-all duration-200
                      ${isActive
                        ? 'text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                      }
                    `}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 rounded-lg"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 桌面端主题切换 */}
          <div className="hidden sm:block flex-shrink-0">
            <ThemeToggle />
          </div>

          {/* 移动端菜单按钮 */}
          <div className="sm:hidden">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="菜单"
            >
              <Bars3Icon className="h-6 w-6" />
            </motion.button>
          </div>
        </div>

        {/* 移动端导航菜单 */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeMenu}
                className="fixed inset-0 -z-10 bg-black/20 dark:bg-black/40 backdrop-blur-sm"
              />
              
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", bounce: 0 }}
                className="absolute left-4 right-4 top-full mt-2 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700"
              >
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMenu}
                        className={`
                          flex items-center gap-3 px-4 py-3 rounded-lg
                          text-sm font-medium transition-colors
                          ${isActive
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }
                        `}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                        <span className="ml-auto text-xs opacity-60">
                          {item.title}
                        </span>
                      </Link>
                    );
                  })}
                </div>

                {/* 移动端主题切换 */}
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-3">
                    <ThemeToggle variant="mobile" />
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
} 