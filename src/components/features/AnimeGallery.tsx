'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowPathIcon,
  PhotoIcon,
  ExclamationCircleIcon,
  ArrowsPointingOutIcon,
  TagIcon,
  UserIcon,
  CalendarIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  ViewColumnsIcon,
  Square2StackIcon,
  FunnelIcon,
  ShieldExclamationIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  XCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface ImageData {
  pid: number;
  p: number;
  uid: number;
  title: string;
  author: string;
  r18: boolean;
  width: number;
  height: number;
  tags: string[];
  ext: string;
  aiType: number;
  uploadDate: number;
  urls: {
    original?: string;
    regular?: string;
    small?: string;
    thumb?: string;
    mini?: string;
  };
}

interface ApiResponse {
  error: string;
  data: ImageData[];
}

interface FilterOptions {
  excludeAI: boolean;
  aspectRatio: string;
  numPerPage: number;
  gridCols: 2 | 3 | 4;
  r18: 0 | 1 | 2;
}

// 预设标签组
const PRESET_TAGS = {
  角色: ['萝莉', '少女', '御姐', '兽耳', '女仆', '制服'],
  风格: ['可爱', '清纯', '唯美', '治愈', '泳装', '古风'],
  场景: ['日常', '校园', '风景', '夜景', '室内', '街道'],
  其他: ['壁纸', '竖屏', '横屏', '渐变', '简约', '二次元']
};

export default function AnimeGallery() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAgeConfirm, setShowAgeConfirm] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    excludeAI: true,
    aspectRatio: '',
    numPerPage: 8,
    gridCols: 4,
    r18: 0
  });
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [r18Unlocked, setR18Unlocked] = useState(false);
  const [selectedR18Value, setSelectedR18Value] = useState<0 | 1 | 2>(0);
  const [selectedTagCategory, setSelectedTagCategory] = useState<keyof typeof PRESET_TAGS | null>(null);
  const [showR18Warning, setShowR18Warning] = useState(false);

  // 宽高比选项
  const aspectRatioOptions = [
    { label: '全部', value: '' },
    { label: '横图', value: 'gt1' },
    { label: '竖图', value: 'lt1' },
    { label: '方图', value: 'eq1' },
    { label: '16:9', value: 'gt1.7lt1.8' }
  ];

  // 每页数量选项
  const numPerPageOptions = [4, 8, 12, 16, 20];

  // R18 选项
  const r18Options = [
    { label: '全年龄', value: 0 },
    { label: 'R18', value: 1 },
    { label: '混合', value: 2 }
  ];

  // 处理 R18 设置
  const handleR18Change = (value: 0 | 1 | 2) => {
    if (value !== 0) {
      if (!r18Unlocked) {
        // 先显示警告
        setShowR18Warning(true);
        setSelectedR18Value(value);
        return;
      }
    }
    setFilters(prev => ({ ...prev, r18: value }));
  };

  // 确认年龄
  const confirmAge = () => {
    setAgeConfirmed(true);
    setShowAgeConfirm(false);
    // 设置用户选择的 R18 值
    setFilters(prev => ({ ...prev, r18: 1 }));
  };

  // 获取图片
  const fetchImages = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/anime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          r18: filters.r18,
          num: filters.numPerPage,
          size: ['regular', 'small'],
          tag: searchTags.length > 0 ? searchTags : undefined,
          excludeAI: filters.excludeAI,
          aspectRatio: filters.aspectRatio || undefined
        })
      });

      if (!response.ok) {
        throw new Error('获取图片失败');
      }

      const data: ApiResponse = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setImages(data.data);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : '获取图片失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 重置为默认设置
  const resetToDefault = () => {
    setFilters({
      excludeAI: true,
      aspectRatio: '',
      numPerPage: 8,
      gridCols: 4,
      r18: 0
    });
    setSearchTags([]);
    setSelectedTagCategory(null);
  };

  // 添加标签（优化版本）
  const addTag = (tag: string) => {
    if (tag && !searchTags.includes(tag) && searchTags.length < 3) {
      setSearchTags(prev => [...prev, tag]);
      // 添加标签后自动关闭当前类别
      setSelectedTagCategory(null);
    }
  };

  // 移除标签
  const removeTag = (tagToRemove: string) => {
    setSearchTags(searchTags.filter(tag => tag !== tagToRemove));
  };

  // 格式化日期
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 初始加载
  useEffect(() => {
    fetchImages();
  }, [searchTags]);

  // 获取列数类名
  const getGridColsClass = () => {
    switch (filters.gridCols) {
      case 2: return 'grid-cols-1 sm:grid-cols-2';
      case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    }
  };

  // 退出解锁
  const handleLogout = () => {
    setR18Unlocked(false);
    setFilters(prev => ({ ...prev, r18: 0 })); // 重置为非R18模式
    setSelectedR18Value(0);
  };

  // 验证密码 (使用更安全的方式)
  const verifyPassword = () => {
    // 使用简单的混淆来避免密码直接暴露在代码中
    const validPassword = atob('Z3V5aW5nMjMyM0A=');
    if (password === validPassword) {
      setR18Unlocked(true);
      setShowPasswordDialog(false);
      setPassword('');
      setPasswordError(false);
      setFilters(prev => ({ ...prev, r18: selectedR18Value }));
    } else {
      setPasswordError(true);
    }
  };

  // 处理密码输入
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyPassword();
  };

  // 处理警告确认
  const handleWarningConfirm = () => {
    setShowR18Warning(false);
    setShowPasswordDialog(true);
  };

  // 修改每页数量处理
  const handleNumPerPageChange = (num: number) => {
    setFilters(prev => ({ ...prev, numPerPage: num }));
    // 立即重新获取图片
    fetchImages();
  };

  return (
    <div className="p-4 sm:p-6 pt-0">
      <div className="max-w-7xl mx-auto">
        {/* 标题和工具栏 */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              二次元图片
            </h2>
            <div className="flex items-center gap-2">
              {/* 显示筛选按钮 */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`
                  p-2 rounded-lg transition-colors
                  ${showFilters 
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' 
                    : 'text-gray-500 hover:text-purple-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
                title="筛选选项"
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5" />
              </motion.button>

              {/* 列数切换 */}
              <div className="hidden sm:flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                {[2, 3, 4].map((cols) => (
                  <button
                    key={cols}
                    onClick={() => setFilters(prev => ({ ...prev, gridCols: cols as 2 | 3 | 4 }))}
                    className={`
                      p-1.5 rounded transition-colors
                      ${filters.gridCols === cols
                        ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                        : 'text-gray-500 hover:text-purple-500'
                      }
                    `}
                  >
                    <ViewColumnsIcon className="h-4 w-4" />
                  </button>
                ))}
              </div>

              {/* 刷新按钮 */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fetchImages()}
                disabled={loading}
                className="p-2 text-gray-500 hover:text-purple-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 
                  transition-colors disabled:opacity-50"
                title="换一批"
              >
                <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              </motion.button>
            </div>
          </div>

          {/* 筛选面板 */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
                  {/* AI 作品过滤 */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">排除 AI 作品</span>
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, excludeAI: !prev.excludeAI }))}
                      className={`
                        relative w-11 h-6 rounded-full transition-colors
                        ${filters.excludeAI
                          ? 'bg-purple-500'
                          : 'bg-gray-200 dark:bg-gray-700'
                        }
                      `}
                    >
                      <span className={`
                        absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform
                        ${filters.excludeAI ? 'translate-x-5' : ''}
                      `} />
                    </button>
                  </div>

                  {/* 宽高比选择 */}
                  <div className="space-y-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">宽高比</span>
                    <div className="flex flex-wrap gap-2">
                      {aspectRatioOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => setFilters(prev => ({ ...prev, aspectRatio: option.value }))}
                          className={`
                            px-3 py-1.5 rounded-lg text-sm transition-colors
                            ${filters.aspectRatio === option.value
                              ? 'bg-purple-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }
                          `}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 每页数量 */}
                  <div className="space-y-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">每页显示数量</span>
                    <div className="flex flex-wrap gap-2">
                      {numPerPageOptions.map(num => (
                        <button
                          key={num}
                          onClick={() => handleNumPerPageChange(num)}
                          className={`
                            px-3 py-1.5 rounded-lg text-sm transition-colors
                            ${filters.numPerPage === num
                              ? 'bg-purple-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }
                          `}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* R18 设置 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-300">内容分级</span>
                        {filters.r18 !== 0 && (
                          <span className="px-1.5 py-0.5 text-[10px] bg-red-100 dark:bg-red-900/30 
                            text-red-600 dark:text-red-400 rounded flex items-center gap-1"
                          >
                            <LockClosedIcon className="h-3 w-3" />
                            R18
                          </span>
                        )}
                        {r18Unlocked && (
                          <span className="px-1.5 py-0.5 text-[10px] bg-green-100 dark:bg-green-900/30 
                            text-green-600 dark:text-green-400 rounded flex items-center gap-1"
                          >
                            <CheckCircleIcon className="h-3 w-3" />
                            已解锁
                          </span>
                        )}
                      </div>
                      {/* 添加退出按钮 */}
                      {r18Unlocked && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleLogout}
                          className="px-2 py-1 text-xs text-red-500 hover:text-red-600 
                            hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors
                            flex items-center gap-1"
                        >
                          <LockClosedIcon className="h-3 w-3" />
                          退出解锁
                        </motion.button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {r18Options.map(option => (
                        <button
                          key={option.value}
                          onClick={() => handleR18Change(option.value as 0 | 1 | 2)}
                          className={`
                            inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors
                            ${filters.r18 === option.value
                              ? 'bg-purple-500 text-white'
                              : option.value !== 0 && !r18Unlocked
                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }
                          `}
                        >
                          {option.value === 0 ? (
                            <EyeIcon className="h-4 w-4" />
                          ) : (
                            <div className="relative">
                              <EyeSlashIcon className="h-4 w-4" />
                              {!r18Unlocked && (
                                <LockClosedIcon className="absolute -top-1 -right-1 h-3 w-3" />
                              )}
                            </div>
                          )}
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 标签搜索区域 */}
          <div className="space-y-4">
            {/* 当前标签 */}
            <div className="flex flex-wrap gap-2">
              {searchTags.map(tag => (
                <motion.span
                  key={tag}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 
                    text-purple-600 dark:text-purple-400 rounded-lg text-sm"
                >
                  <TagIcon className="h-4 w-4" />
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="p-0.5 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </motion.span>
              ))}
              {searchTags.length > 0 && (
                <motion.button
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchTags([])}
                  className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 
                    dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  清空标签
                </motion.button>
              )}
            </div>

            {/* 预设标签类别 */}
            <div className="flex flex-wrap gap-2">
              {Object.keys(PRESET_TAGS).map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTagCategory(
                    selectedTagCategory === category ? null : category as keyof typeof PRESET_TAGS
                  )}
                  className={`
                    px-3 py-1.5 rounded-lg text-sm transition-colors
                    ${selectedTagCategory === category
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  {category}
                </motion.button>
              ))}
            </div>

            {/* 预设标签选项 */}
            <AnimatePresence>
              {selectedTagCategory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 
                    dark:border-gray-700 flex flex-wrap gap-2"
                  >
                    {PRESET_TAGS[selectedTagCategory].map((tag) => (
                      <motion.button
                        key={tag}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => addTag(tag)}
                        disabled={searchTags.includes(tag) || searchTags.length >= 3}
                        className={`
                          px-3 py-1.5 rounded-lg text-sm transition-colors
                          ${searchTags.includes(tag)
                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 cursor-not-allowed'
                            : searchTags.length >= 3
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }
                        `}
                      >
                        {tag}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 自定义标签输入 */}
            <div className="relative">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && tagInput) {
                    e.preventDefault();
                    addTag(tagInput);
                    setTagInput('');
                  }
                }}
                placeholder="输入自定义标签，按回车添加（最多3个）..."
                className="w-full px-4 py-2 pl-10 bg-white dark:bg-gray-800 border border-gray-200 
                  dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 
                  dark:focus:ring-purple-400 focus:border-transparent"
              />
              <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* 图片网格 - 使用动态列数 */}
        {loading ? (
          <div className={`grid ${getGridColsClass()} gap-4`}>
            {[...Array(filters.numPerPage)].map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-red-500">
            <ExclamationCircleIcon className="h-12 w-12 mb-4" />
            <p>{error}</p>
          </div>
        ) : (
          <div className={`grid ${getGridColsClass()} gap-4`}>
            <AnimatePresence mode="popLayout">
              {images.map((image) => (
                <motion.div
                  key={`${image.pid}-${image.p}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="group relative aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image.urls.small}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white text-sm font-medium truncate">
                        {image.title}
                      </h3>
                      <p className="text-white/80 text-xs truncate">
                        {image.author}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* 图片详情弹窗 */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-4xl w-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative aspect-[4/3]">
                  <img
                    src={selectedImage.urls.regular}
                    alt={selectedImage.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {selectedImage.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-gray-500 dark:text-gray-400">
                        <UserIcon className="h-4 w-4" />
                        <span>{selectedImage.author}</span>
                        <CalendarIcon className="h-4 w-4 ml-2" />
                        <span>{formatDate(selectedImage.uploadDate)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 
                        dark:hover:text-gray-200"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedImage.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm 
                          text-gray-600 dark:text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 年龄确认对话框 */}
        <AnimatePresence>
          {showAgeConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-md w-full bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl"
              >
                <div className="flex items-center gap-3 text-red-500 mb-4">
                  <ShieldExclamationIcon className="h-6 w-6" />
                  <h3 className="text-lg font-semibold">年龄确认</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  您即将浏览 R18 内容。请确认您已年满 18 周岁，且当前��在地区法律允许浏���此类内容。
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowAgeConfirm(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 
                      dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={confirmAge}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 
                      transition-colors"
                  >
                    确认已满18岁
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* R18 警告对话框 */}
        <AnimatePresence>
          {showR18Warning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
              onClick={() => setShowR18Warning(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-md w-full bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 text-red-500 mb-4">
                  <ShieldExclamationIcon className="h-6 w-6" />
                  <h3 className="text-lg font-semibold">内容警告</h3>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="text-red-600 dark:text-red-400 font-medium mb-2">
                      您即将访问 R18 内容
                    </p>
                    <ul className="text-sm text-red-500 dark:text-red-400 space-y-1.5">
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5">•</span>
                        <span>此内容仅适合年满 18 周岁的用户访问</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5">•</span>
                        <span>请确保您所在地区法律允许访问此类内容</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5">•</span>
                        <span>需要通过密码验证才能访问此内容</span>
                      </li>
                    </ul>
                  </div>

                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    点击"继续"表示您已阅读并同意以上内容，且确认您已年满 18 周岁。
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowR18Warning(false)}
                      className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 
                        dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleWarningConfirm}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 
                        transition-colors flex items-center gap-2"
                    >
                      <ShieldExclamationIcon className="h-4 w-4" />
                      继续访问
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 密码验证对话框 */}
        <AnimatePresence>
          {showPasswordDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
              onClick={() => {
                setShowPasswordDialog(false);
                setPassword('');
                setPasswordError(false);
              }}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-md w-full bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3 text-purple-500">
                    <LockClosedIcon className="h-6 w-6" />
                    <h3 className="text-lg font-semibold">访问验证</h3>
                  </div>
                  <button
                    onClick={() => {
                      setShowPasswordDialog(false);
                      setPassword('');
                      setPasswordError(false);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-500 dark:text-gray-500 
                      dark:hover:text-gray-400 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
                
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600 dark:text-gray-300">
                      请输入访问密码
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setPasswordError(false);
                        }}
                        className={`
                          w-full px-4 py-2 bg-white dark:bg-gray-800 border rounded-lg
                          focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 
                          focus:border-transparent transition-colors
                          ${passwordError 
                            ? 'border-red-500 dark:border-red-500' 
                            : 'border-gray-200 dark:border-gray-700'
                          }
                        `}
                        placeholder="请输入访问密码"
                        autoComplete="new-password"
                      />
                      {passwordError && (
                        <div className="absolute right-0 top-0 bottom-0 flex items-center pr-3">
                          <XCircleIcon className="h-5 w-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    {passwordError && (
                      <p className="text-sm text-red-500">密码错误</p>
                    )}
                  </div>

                  {/* 添加密码申请说明 */}
                  <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-sm space-y-2">
                    <p className="text-gray-600 dark:text-gray-300">
                      如何获取访问密码？
                    </p>
                    <div className="flex items-start gap-2 text-gray-500 dark:text-gray-400">
                      <span className="mt-0.5">1.</span>
                      <p>
                        发送邮件至：
                        <a 
                          href="mailto:2739218253@qq.com"
                          className="text-purple-500 hover:text-purple-600 dark:text-purple-400 
                            dark:hover:text-purple-300 underline"
                        >
                          2739218253@qq.com
                        </a>
                      </p>
                    </div>
                    <div className="flex items-start gap-2 text-gray-500 dark:text-gray-400">
                      <span className="mt-0.5">2.</span>
                      <p>
                        邮件主题请注明：
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          申请R18访问密码
                        </span>
                      </p>
                    </div>
                    <div className="flex items-start gap-2 text-gray-500 dark:text-gray-400">
                      <span className="mt-0.5">3.</span>
                      <p>等待管理员审核并回复密码</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordDialog(false);
                        setPassword('');
                        setPasswordError(false);
                      }}
                      className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 
                        dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 
                        transition-colors flex items-center gap-2"
                    >
                      <LockClosedIcon className="h-4 w-4" />
                      验证
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 