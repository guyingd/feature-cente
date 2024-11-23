'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowPathIcon, 
  ExclamationCircleIcon,
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon
} from '@heroicons/react/24/outline';

interface ApiResponse {
  code: number;
  msg: string;
  media_url: string;
  api_source: string;
}

export default function RandomMusic() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [musicUrl, setMusicUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

  const fetchMusic = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('https://api.pearktrue.cn/api/randommusic/');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      console.log('API Response:', data);
      
      if (data.code === 200) {
        setMusicUrl(data.media_url);
        // 设置音频并自动播放
        if (audioRef.current) {
          audioRef.current.src = data.media_url;
          // 设置音量
          audioRef.current.volume = volume;
          // 尝试自动播放
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
              })
              .catch(error => {
                console.error('Auto-play failed:', error);
                setIsPlaying(false);
              });
          }
        }
      } else {
        throw new Error(data.msg || '获取音乐失败');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取音乐失败';
      console.error('Fetch error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [volume]);

  // 添加音频加载事件处理
  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;

      const handleCanPlay = () => {
        // 音频准备就绪时尝试播放
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(error => {
              console.error('Auto-play failed:', error);
              setIsPlaying(false);
            });
        }
      };

      audio.addEventListener('canplay', handleCanPlay);
      return () => {
        audio.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, []);

  // 添加音频错误处理
  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;

      const handleError = (e: Event) => {
        console.error('Audio error:', e);
        setError('音频加载失败，请尝试重新获取');
        setIsPlaying(false);
      };

      audio.addEventListener('error', handleError);
      return () => {
        audio.removeEventListener('error', handleError);
      };
    }
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="p-4 sm:p-6 pt-0">
      <div className="flex flex-col space-y-4">
        {/* 音频播放器 */}
        <audio
          ref={audioRef}
          src={musicUrl}
          onEnded={() => setIsPlaying(false)}
          onError={() => setError('音乐加载失败')}
          className="hidden"
          preload="auto"
        />

        {/* 控制栏 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlay}
              disabled={loading || !musicUrl}
              className={`p-3 rounded-full transition-colors ${
                loading || !musicUrl
                  ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-500 text-white'
              }`}
            >
              {isPlaying ? (
                <PauseIcon className="h-6 w-6" />
              ) : (
                <PlayIcon className="h-6 w-6" />
              )}
            </motion.button>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                {isMuted ? (
                  <SpeakerXMarkIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <SpeakerWaveIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 accent-purple-600"
              />
            </div>
          </div>
          <motion.button
            whileHover={{ scale: !loading ? 1.05 : 1 }}
            whileTap={{ scale: !loading ? 0.95 : 1 }}
            onClick={fetchMusic}
            disabled={loading}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${
              loading
                ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {loading ? (
              <ArrowPathIcon className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <ArrowPathIcon className="h-5 w-5" />
                <span>换一首</span>
              </>
            )}
          </motion.button>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <ExclamationCircleIcon className="h-5 w-5" />
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* 播放器状态 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`relative w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/50 ${isPlaying ? 'animate-spin-slow' : ''}`}>
                <div className="absolute inset-3 rounded-full bg-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  网易云音乐
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isPlaying ? '正在播放' : '已暂停'}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              音量: {Math.round(volume * 100)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 