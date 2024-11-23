import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, requestData } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // 构建请求配置
    const requestConfig: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Referer': 'https://www.pixiv.net/',
      },
      body: JSON.stringify(requestData),
      cache: 'no-cache',
      credentials: 'omit',
      mode: 'cors',
      redirect: 'follow',
    };

    console.log('Proxying request to:', url);
    console.log('Request config:', requestConfig);

    const response = await fetch(url, requestConfig);
    
    if (!response.ok) {
      console.error('API response error:', {
        status: response.status,
        statusText: response.statusText,
      });
      
      // 尝试读取错误响应
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = await response.text();
      }
      
      console.error('Error response data:', errorData);
      
      return NextResponse.json({
        error: `API response error: ${response.status} ${response.statusText}`,
        details: errorData
      }, { status: response.status });
    }

    const responseData = await response.json();
    console.log('API response success:', responseData);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Proxy server error:', error);
    
    // 构建详细的错误信息
    const errorMessage = error instanceof Error 
      ? {
          message: error.message,
          name: error.name,
          stack: error.stack,
        }
      : error;

    return NextResponse.json(
      { 
        error: 'Proxy server error',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

// 添加 OPTIONS 请求处理，用于 CORS 预检请求
export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 