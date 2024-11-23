import { NextResponse } from 'next/server';
import os from 'os';

let requestCount = 0;
const startTime = Date.now();

export async function GET() {
  try {
    // 增加请求计数
    requestCount++;

    // 获取CPU使用率
    const cpus = os.cpus();
    const cpuUsage = cpus.reduce((acc, cpu) => {
      const total = Object.values(cpu.times).reduce((a, b) => a + b);
      const idle = cpu.times.idle;
      return acc + ((total - idle) / total) * 100;
    }, 0) / cpus.length;

    // 获取内存使用率
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const memoryUsage = ((totalMem - freeMem) / totalMem) * 100;

    // 获取运行时间（秒）
    const uptime = Math.floor((Date.now() - startTime) / 1000);

    return NextResponse.json({
      code: 200,
      data: {
        cpuUsage,
        memoryUsage,
        uptime,
        requestCount,
        systemInfo: {
          platform: os.platform(),
          arch: os.arch(),
          version: os.version(),
          totalMemory: formatBytes(totalMem),
          freeMemory: formatBytes(freeMem),
          cpuCores: cpus.length
        }
      }
    });
  } catch (error) {
    console.error('System status error:', error);
    return NextResponse.json(
      {
        code: 500,
        error: 'Failed to get system status'
      },
      { status: 500 }
    );
  }
}

function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
} 