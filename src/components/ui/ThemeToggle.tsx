'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

interface ThemeToggleProps {
  variant?: 'default' | 'mobile';
}

export function ThemeToggle({ variant = 'default' }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (variant === 'mobile') {
    return (
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <span>切换主题</span>
        <motion.div
          initial={false}
          animate={{
            rotate: theme === 'dark' ? 180 : 0,
            scale: theme === 'dark' ? 0.8 : 1
          }}
          transition={{ duration: 0.3 }}
        >
          {theme === 'dark' ? (
            <MoonIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          ) : (
            <SunIcon className="h-5 w-5 text-yellow-600" />
          )}
        </motion.div>
      </button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={`
        flex items-center gap-2
        p-2 rounded-lg
        bg-gray-100/50 dark:bg-gray-800/50
        hover:bg-gray-200/50 dark:hover:bg-gray-700/50
        transition-colors duration-200
      `}
      aria-label="切换主题"
    >
      {theme === 'dark' ? (
        <MoonIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
      ) : (
        <SunIcon className="h-5 w-5 text-yellow-600" />
      )}
    </motion.button>
  );
} 