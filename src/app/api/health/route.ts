import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 健康检查逻辑
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      deployEnv: process.env.DEPLOY_ENV || 'unknown',
    };

    return NextResponse.json(health, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Health check failed' },
      { status: 500 }
    );
  }
}

