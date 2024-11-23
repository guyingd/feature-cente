const handleGenerate = async () => {
  try {
    const result = await getRandomImage(tags || null);
    setImage(result.url);
  } catch (error) {
    message.error('生成图片失败，请重试');
  }
}; 