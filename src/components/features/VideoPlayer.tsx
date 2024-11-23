'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowPathIcon, 
  ExclamationCircleIcon,
  PlayIcon,
  PauseIcon,
} from '@heroicons/react/24/outline';

interface VideoResponse {
  code: number;
  msg: string;
  video: string;
}

export default function VideoPlayer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 获取视频
  const fetchVideo = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      setIsPlaying(false);
      
      const response = await fetch('https://api.pearktrue.cn/api/random/xjj/?type=json');
      
      if (!response.ok) {
        throw new Error('获取视频失败');
      }
      
      const data = await response.json();
      
      if (data.code === 200 && data.video) {
        setVideoUrl(data.video);
        
        // 重置视频状态
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.load();
        }
      } else {
        throw new Error('获取视频失败');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('获取视频失败，请重试');
    } finally {
      setLoading(false);
    }
  }, []);

  // 切换播放/暂停
  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {
          setError('视频播放失败');
        });
      }
    }
  }, [isPlaying]);

  // 初始加载
  useEffect(() => {
    fetchVideo();
  }, [fetchVideo]);

  return (
    <div className="p-4 sm:p-6 pt-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={loading ? 'loading' : error ? 'error' : 'video'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[400px] bg-gray-100 dark:bg-gray-800 rounded-xl">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">加载中...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-[400px] bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
              <ExclamationCircleIcon className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-red-500 mb-4 text-center">{error}</p>
              <button
                onClick={fetchVideo}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
              >
                <ArrowPathIcon className="h-5 w-5" />
                重新加载
              </button>
            </div>
          ) : (
            <div className="relative bg-black rounded-xl overflow-hidden mx-auto">
              <div className="relative w-full mx-auto" style={{ maxWidth: '300px' }}>
                {/* 视频播放器 */}
                <video
                  ref={videoRef}
                  className="w-full aspect-[9/16] object-contain bg-black"
                  playsInline
                  controls
                  onError={() => setError('视频加载失败')}
                  onWaiting={() => setIsBuffering(true)}
                  onPlaying={() => {
                    setIsBuffering(false);
                    setIsPlaying(true);
                  }}
                  onPause={() => setIsPlaying(false)}
                  src={videoUrl}
                >
                  您的浏览器不支持视频播放
                </video>

                {/* 加载提示 */}
                {isBuffering && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent"></div>
                  </div>
                )}

                {/* 换一个按钮 */}
                <div className="absolute top-4 right-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={fetchVideo}
                    className="flex items-center gap-1 px-2 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm backdrop-blur-sm"
                  >
                    <ArrowPathIcon className="h-4 w-4" />
                    <span>换一个</span>
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 