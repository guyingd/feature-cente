import { useState, useEffect } from 'react';
import '../styles/AnimeGallery.css';

interface AnimeImage {
  url: string;
  title?: string;
}

const AnimeGallery = () => {
  const [image, setImage] = useState<AnimeImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tags, setTags] = useState('');

  const fetchAnimeImage = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 处理用户输入的标签
      const processedTags = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag)
        .join(',');
      
      // 构建URL和查询字符串
      const params = {
        tags: processedTags || 'anime,safe', // 如果没有输入标签，使用默认值
      };
      
      const queryString = new URLSearchParams(params).toString();
      const url = `https://api.waifu.pics/sfw/waifu?${queryString}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('获取图片失败');
      }
      
      const data = await response.json();
      setImage({ url: data.url });
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimeImage();
  }, []);

  return (
    <div className="anime-gallery">
      <div className="input-container">
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="输入标签，用逗号分隔 (例如: 萝莉,白丝)"
          className="tags-input"
        />
        <button 
          onClick={fetchAnimeImage}
          disabled={loading}
        >
          搜索
        </button>
      </div>

      {loading && <div>加载中...</div>}
      {error && <div className="error">错误: {error}</div>}
      {image && (
        <div className="image-container">
          <img 
            src={image.url} 
            alt="二次元图片"
            loading="lazy"
            onClick={fetchAnimeImage}
          />
        </div>
      )}
    </div>
  );
};

export default AnimeGallery; 