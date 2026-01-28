'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({
  error,
  reset,
}: ErrorProps) {
  useEffect(() => {
    // 记录错误到错误报告服务
    console.error('应用错误:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--page-bg)] px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-[var(--accent)] mb-4">
            500
          </h1>
          <h2 className="text-2xl font-semibold text-[var(--page-foreground)] mb-4">
            应用错误
          </h2>
          <p className="text-[var(--light-gray)] mb-6">
            {error.message || '发生了一些意外错误，请稍后再试。'}
          </p>
        </div>
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-[var(--accent)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            重试
          </button>
          <a
            href="/"
            className="px-6 py-3 bg-[var(--dark-gray)] text-[var(--page-foreground)] rounded-lg font-medium hover:bg-opacity-80 transition-colors"
          >
            返回首页
          </a>
        </div>

        {process.env.NODE_ENV === 'development' && error.digest && (
          <div className="mt-8 p-4 bg-[var(--dark-gray)] rounded-lg text-left">
            <p className="text-xs text-[var(--light-gray)] font-mono break-all">
              Error ID: {error.digest}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

