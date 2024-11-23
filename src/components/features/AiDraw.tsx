'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowPathIcon, 
  ExclamationCircleIcon, 
  PaperAirplaneIcon,
  PhotoIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

interface ApiResponse {
  code: number;
  msg: string;
  style: string;
  model: string;
  prompt: string;
  imgurl: string;
  api_source: string;
}

type ModelType = 'normal' | 'vertical' | 'horizontal';

const MODEL_TYPES = [
  { label: '方形 (1:1)', value: 'normal' },
  { label: '竖形 (2:3)', value: 'vertical' },
  { label: '横形 (3:2)', value: 'horizontal' },
];

export default function AiDraw() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [model, setModel] = useState<ModelType>('normal');
  const [showSettings, setShowSettings] = useState(false);

  const generateImage = useCallback(async () => {
    if (!prompt.trim() || loading) return;

    try {
      setLoading(true);
      setError('');
      
      const queryParams = new URLSearchParams({
        prompt: prompt.trim(),
        model,
      });

      const response = await fetch(`https://api.pearktrue.cn/api/stablediffusion/?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      console.log('API Response:', data);
      
      if (data.code === 200) {
        setResult(data);
      } else {
        throw new Error(data.msg || '生成图片失败');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '生成图片时出错';
      console.error('Generation error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [prompt, model]);

  return (
    <div className="p-4 sm:p-6 pt-0">
      <div className="flex flex-col space-y-4">
        {/* 控制栏 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(!showSettings)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <AdjustmentsHorizontalIcon className="h-4 w-4" />
            <span>模型设置</span>
          </motion.button>
        </div>

        {/* 设置面板 */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    图片尺寸
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {MODEL_TYPES.map(type => (
                      <button
                        key={type.value}
                        onClick={() => setModel(type.value as ModelType)}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                          model === type.value
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 输入区域 */}
        <div className="flex gap-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="输入绘画提示词..."
            className="flex-1 min-h-[44px] max-h-[120px] p-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg resize-y"
            disabled={loading}
          />
          <motion.button
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            onClick={generateImage}
            disabled={loading || !prompt.trim()}
            className={`px-4 py-2 rounded-lg transition-colors ${
              loading || !prompt.trim()
                ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {loading ? (
              <ArrowPathIcon className="h-5 w-5 animate-spin" />
            ) : (
              <PaperAirplaneIcon className="h-5 w-5" />
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

        {/* 结果展示 */}
        {result && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg"
          >
            <div className="space-y-4">
              {/* 图片信息 */}
              <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-400">
                <p>提示词: {result.prompt}</p>
                <p>模型: {result.model}</p>
                <p>风格: {result.style}</p>
              </div>

              {/* 图片预览 */}
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                  src={result.imgurl}
                  alt={result.prompt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/600x600?text=加载失败';
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => window.open(result.imgurl, '_blank')}
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                  title="查看原图"
                >
                  <PhotoIcon className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 