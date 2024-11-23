import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 使用 Map 来存储最近的请求时间
const requestTimes = new Map<string, number>();
const THROTTLE_WINDOW = 5000; // 5秒内的请求只计数一次

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // 排除不需要计数的路径
  if (
    path.startsWith('/_next') || 
    path.startsWith('/api/request-counter') ||
    path.startsWith('/favicon.ico') ||
    path.includes('.css') ||
    path.includes('.jpg') ||
    path.includes('.png')
  ) {
    return NextResponse.next();
  }

  try {
    const now = Date.now();
    const lastRequestTime = requestTimes.get(path) || 0;

    // 如果距离上次请求超过5秒，才增加计数
    if (now - lastRequestTime >= THROTTLE_WINDOW) {
      requestTimes.set(path, now);

      const protocol = request.nextUrl.protocol;
      const host = request.headers.get('host');
      
      await fetch(`${protocol}//${host}/api/request-counter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to increment request counter:', error);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/request-counter).*)',
  ],
}; 