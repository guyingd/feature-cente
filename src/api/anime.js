export const getAnimeImage = async () => {
  // 设置基础参数
  const baseParams = {
    tags: [
      'anime', 
      'illustration',
      'safe',  // 确保内容安全
      'high_quality'
    ].join(','),
    orientation: 'PORTRAIT',  // 竖向图片
    size: 'MEDIUM'  // 中等尺寸
  };

  try {
    const response = await fetch(`${API_BASE_URL}/images/random`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      params: baseParams
    });

    if (!response.ok) {
      throw new Error('获取图片失败');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取二次元图片时出错:', error);
    throw error;
  }
} 