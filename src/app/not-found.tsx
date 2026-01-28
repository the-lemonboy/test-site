import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--page-bg)] px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-[var(--accent)] mb-4">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-[var(--page-foreground)] mb-4">
            页面未找到
          </h2>
          <p className="text-[var(--light-gray)] mb-6">
            抱歉，您访问的页面不存在或已被移动。
          </p>
        </div>
        
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-[var(--accent)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}

