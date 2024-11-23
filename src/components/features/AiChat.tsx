'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PaperAirplaneIcon, 
  TrashIcon,
  ArrowPathIcon,
  SparklesIcon,
  UserCircleIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatResponse {
  code: number;
  msg: string;
  message: string;
  api_source?: string;
}

export default function AiChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([
    {
      role: 'system',
      content: 'You are a helpful assistant.'
    }
  ]);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 处理发送消息
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    };

    // 更新消息显示
    setMessages(prev => [...prev, userMessage]);
    // 更新聊天历史
    setChatHistory(prev => [...prev, { role: 'user', content: input.trim() }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://api.pearktrue.cn/api/deepseek/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...chatHistory,
            { role: 'user', content: userMessage.content }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('请求失败');
      }

      const data: ChatResponse = await response.json();
      
      if (data.code === 200) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.message,
          timestamp: Date.now()
        };

        // 更新消息显示
        setMessages(prev => [...prev, assistantMessage]);
        // 更新聊天历史
        setChatHistory(prev => [...prev, { role: 'assistant', content: data.message }]);
      } else {
        throw new Error(data.msg || '请求失败');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: '抱歉，我遇到了一些问题。请稍后再试。',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // 清空对话
  const clearChat = () => {
    setMessages([]);
    setChatHistory([{
      role: 'system',
      content: 'You are a helpful assistant.'
    }]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="p-4 sm:p-6 pt-0">
      <div className="max-w-4xl mx-auto">
        {/* 聊天界面 */}
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden min-h-[600px] flex flex-col">
          {/* 顶部栏 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <SparklesIcon className="h-5 w-5 text-purple-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI 助手</h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearChat}
              className="p-2 text-gray-500 hover:text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="清空对话"
            >
              <TrashIcon className="h-5 w-5" />
            </motion.button>
          </div>

          {/* 消息列表 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <AnimatePresence mode="popLayout">
              {messages.map((message, index) => (
                <motion.div
                  key={message.timestamp}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    duration: 0.3,
                    ease: 'easeOut'
                  }}
                  className={`
                    flex items-start gap-3
                    ${message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'}
                    ${index === messages.length - 1 ? 'mb-2' : ''}
                  `}
                >
                  {/* 头像 */}
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className={`
                      flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                      ${message.role === 'assistant'
                        ? 'bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30'
                        : 'bg-gradient-to-br from-purple-500 to-blue-500'
                      }
                      shadow-lg
                    `}
                  >
                    {message.role === 'assistant' ? (
                      <ComputerDesktopIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    ) : (
                      <UserCircleIcon className="h-5 w-5 text-white" />
                    )}
                  </motion.div>

                  {/* 消息气泡 */}
                  <div className={`
                    relative max-w-[80%] rounded-2xl px-4 py-3 pb-6
                    ${message.role === 'assistant'
                      ? 'bg-gray-100 dark:bg-gray-700/70 backdrop-blur-sm'
                      : 'bg-gradient-to-br from-purple-500 to-blue-500 text-white ml-auto'
                    }
                  `}>
                    {/* 消息内容 */}
                    <div className="relative">
                      <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                        {message.content}
                      </p>
                    </div>

                    {/* 时间戳 */}
                    <div className={`
                      absolute bottom-1 right-3 text-[10px]
                      ${message.role === 'assistant' 
                        ? 'text-gray-400 dark:text-gray-500' 
                        : 'text-white/70'
                      }
                      flex items-center gap-1
                    `}>
                      <span>
                        {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    {/* 气泡尾巴 */}
                    <div className={`
                      absolute bottom-[6px]
                      ${message.role === 'assistant' 
                        ? 'left-[-6px] border-l-gray-100 dark:border-l-gray-700/70' 
                        : 'right-[-6px] border-r-purple-500'
                      }
                      w-3 h-3 transform rotate-45
                      ${message.role === 'assistant'
                        ? 'bg-gray-100 dark:bg-gray-700/70'
                        : 'bg-gradient-to-br from-purple-500 to-blue-500'
                      }
                    `} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* 加载动画优化 */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30">
                    <ComputerDesktopIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700/70 rounded-2xl p-3 backdrop-blur-sm">
                    <div className="flex space-x-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.2 }}
                        className="w-2 h-2 bg-purple-500 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.4 }}
                        className="w-2 h-2 bg-purple-500 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.6 }}
                        className="w-2 h-2 bg-purple-500 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* 输入区域 */}
          <form onSubmit={handleSubmit} className="relative p-4 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="relative max-w-4xl mx-auto">
              {/* 主输入框容器 */}
              <div className="relative group bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-all duration-300
                ring-1 ring-gray-200 dark:ring-gray-700 
                hover:ring-purple-500/50 dark:hover:ring-purple-500/30
                focus-within:ring-2 focus-within:ring-purple-500 dark:focus-within:ring-purple-400
                focus-within:shadow-purple-500/25"
              >
                {/* 文本输入区 */}
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder="输入你的问题..."
                  className="w-full resize-none rounded-2xl border-0 bg-transparent p-4 pr-20 text-sm 
                    placeholder:text-gray-400 dark:placeholder:text-gray-500
                    focus:ring-0
                    min-h-[100px] max-h-[200px]"
                  style={{ height: '100px' }}
                />

                {/* 装饰性渐变边框 */}
                <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 
                  rounded-2xl opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 
                  transition-opacity duration-500 -z-10" 
                />

                {/* 按钮组容器 */}
                <div className="absolute right-2 bottom-2 flex items-center gap-1.5">
                  {/* 字数统计 */}
                  <div className={`
                    px-2 py-1 text-xs rounded-md transition-colors
                    ${input.length > 500 
                      ? 'text-red-500 bg-red-50 dark:bg-red-500/10' 
                      : 'text-gray-400 dark:text-gray-500'
                    }
                  `}>
                    {input.length}/500
                  </div>

                  {/* 清空按钮 */}
                  <AnimatePresence>
                    {input.trim() && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        type="button"
                        onClick={() => setInput('')}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 
                          dark:hover:text-gray-300 rounded-xl 
                          hover:bg-gray-100 dark:hover:bg-gray-700/50
                          transition-colors"
                        title="清空输入"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </motion.button>
                    )}
                  </AnimatePresence>

                  {/* 发送按钮 */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={!input.trim() || loading}
                    className={`
                      p-2 rounded-xl transition-all duration-300
                      ${!input.trim() || loading
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                        : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg'
                      }
                    `}
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <ArrowPathIcon className="h-5 w-5" />
                      </motion.div>
                    ) : (
                      <PaperAirplaneIcon className="h-5 w-5" />
                    )}
                  </motion.button>
                </div>
              </div>

              {/* 底部提示信息 */}
              <div className="mt-2 px-1 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="inline-block px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px]">Enter</span>
                    <span>发送</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="inline-block px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px]">Shift + Enter</span>
                    <span>换行</span>
                  </div>
                </div>
                <div className="text-[10px] opacity-80">
                  Powered by Deepseek
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* 可以添加一个提示信息 */}
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[400px] text-gray-500 dark:text-gray-400">
          <SparklesIcon className="h-12 w-12 mb-4 text-purple-500/50" />
          <p className="text-lg font-medium mb-2">AI 助手</p>
          <p className="text-sm text-center max-w-md">
            我是一个智能助手，可以帮助你回答问题、提供建议或者进行日常对话。
            <br />
            试着问我一些问题吧！
          </p>
        </div>
      )}
    </div>
  );
} 