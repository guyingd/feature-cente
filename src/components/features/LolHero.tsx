'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowPathIcon, 
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { Card, Button, Input, LoadingSpinner, Dialog, Tooltip, Toast } from '../ui';
import { staggerContainer } from '@/lib/animations';
import toast from 'react-hot-toast';

// 常用英雄列表
const POPULAR_HEROES = [
  '黑暗之女', '德玛西亚之力', '寒冰射手', '无双剑姬', '影流之主',
  '疾风剑豪', '暗夜猎手', '虚空之女', '九尾妖狐', '光辉女郎'
];

interface HeroResponse {
  code: number;
  msg: string;
  hero: string;
  imgurl: string;
  api_source: string;
}

export default function LolHero() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [heroName, setHeroName] = useState('');
  const [heroData, setHeroData] = useState<HeroResponse | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [imageScale, setImageScale] = useState(100);

  const fetchHeroInfo = useCallback(async (name: string) => {
    if (!name.trim() || loading) return;

    try {
      setLoading(true);
      setError('');
      
      const queryParams = new URLSearchParams({
        hero: name.trim(),
        type: 'json'
      });

      const response = await fetch(`https://api.pearktrue.cn/api/lolhero/?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: HeroResponse = await response.json();
      
      if (data.code === 200) {
        setHeroData(data);
        toast.success('获取英雄信息成功！');
      } else {
        throw new Error(data.msg || '获取英雄信息失败');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取英雄信息失败';
      console.error('Fetch error:', err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return (
    <div className="p-4 sm:p-6 pt-0">
      <Toast />
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="flex flex-col space-y-4"
      >
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              value={heroName}
              onChange={(e) => setHeroName(e.target.value)}
              placeholder="请输入英雄名称..."
            />
            <Button
              onClick={() => fetchHeroInfo(heroName)}
              disabled={loading || !heroName.trim()}
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <MagnifyingGlassIcon className="h-5 w-5" />
                  <span>搜索英雄</span>
                </>
              )}
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {POPULAR_HEROES.map((hero) => (
              <Tooltip key={hero} content={`点击搜索 ${hero}`}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setHeroName(hero);
                    fetchHeroInfo(hero);
                  }}
                >
                  {hero}
                </Button>
              </Tooltip>
            ))}
          </div>
        </Card>

        {heroData && !error && (
          <Card className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {heroData.hero}
                </h3>
              </div>
              
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                  src={heroData.imgurl}
                  alt={heroData.hero}
                  className="w-full h-full object-cover cursor-pointer"
                  loading="lazy"
                  onClick={() => setIsImageDialogOpen(true)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/800x600?text=加载失败';
                  }}
                />
              </div>
            </div>
          </Card>
        )}

        <Dialog
          isOpen={isImageDialogOpen}
          onClose={() => setIsImageDialogOpen(false)}
          title={heroData?.hero || '英雄图片'}
        >
          {heroData && (
            <div className="mt-2">
              <img
                src={heroData.imgurl}
                alt={heroData.hero}
                className="w-full rounded-lg"
              />
            </div>
          )}
        </Dialog>
      </motion.div>
    </div>
  );
} 