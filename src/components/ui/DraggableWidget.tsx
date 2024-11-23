'use client';

import { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { ArrowsPointingInIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';

interface DraggableWidgetProps {
  children: React.ReactNode;
  title: string;
  defaultPosition?: { x: number; y: number };
}

export function DraggableWidget({ children, title, defaultPosition = { x: 20, y: 20 } }: DraggableWidgetProps) {
  const [position, setPosition] = useState(defaultPosition);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // 保存位置到 localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem(`widget-position-${title}`);
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    }
  }, [title]);

  const handleDragEnd = (event: any, info: any) => {
    const newPosition = {
      x: position.x + info.offset.x,
      y: position.y + info.offset.y
    };
    setPosition(newPosition);
    localStorage.setItem(`widget-position-${title}`, JSON.stringify(newPosition));
    setIsDragging(false);
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      initial={position}
      animate={{
        x: position.x,
        y: position.y,
        scale: isDragging ? 1.02 : 1
      }}
      className="fixed z-50"
      style={{ touchAction: 'none' }}
    >
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
        isMinimized ? 'w-48' : 'w-80 sm:w-96'
      }`}>
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 cursor-move">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            {isMinimized ? (
              <ArrowsPointingOutIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            ) : (
              <ArrowsPointingInIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>

        {/* 内容区域 */}
        <motion.div
          animate={{
            height: isMinimized ? 0 : 'auto',
            opacity: isMinimized ? 0 : 1
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="p-4">
            {children}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
} 