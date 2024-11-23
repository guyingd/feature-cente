export const getRandomImage = async (tags) => {
  try {
    let url = 'https://api.example.com/random';
    if (tags) {
      const encodedTags = encodeURIComponent(tags);
      url += `?tags=${encodedTags}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('获取随机图片失败:', error);
    throw error;
  }
}; 