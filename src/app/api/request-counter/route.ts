import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

// 使用全局变量存储请求计数
let requestCount = 0;

export async function GET() {
  const headersList = headers();
  return NextResponse.json({ 
    count: requestCount,
    timestamp: Date.now(),
    host: headersList.get('host')
  });
}

export async function POST() {
  requestCount++;
  return NextResponse.json({ 
    count: requestCount,
    timestamp: Date.now()
  });
} 