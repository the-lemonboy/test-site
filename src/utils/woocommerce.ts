'use server';

const STORE_BASE_URL = process.env.STORE_URL ?? 'https://store.camthink.ai';
const WOO_CONSUMER_KEY = process.env.WOO_CONSUMER_KEY;
const WOO_CONSUMER_SECRET = process.env.WOO_CONSUMER_SECRET;

if (!WOO_CONSUMER_KEY || !WOO_CONSUMER_SECRET) {
  // 只在服务器日志中提示，避免在客户端暴露信息
  console.warn(
    '[WooCommerce] WOO_CONSUMER_KEY / WOO_CONSUMER_SECRET 未配置，REST API 将无法访问受保护资源。'
  );
}

function getAuthHeader(): Record<string, string> {
  if (!WOO_CONSUMER_KEY || !WOO_CONSUMER_SECRET) return {};
  const token = Buffer.from(
    `${WOO_CONSUMER_KEY}:${WOO_CONSUMER_SECRET}`,
    'utf8'
  ).toString('base64');
  return {
    Authorization: `Basic ${token}`,
  };
}

export async function wooRestGet<T>(path: string, init?: RequestInit): Promise<T> {
  const url =
    path.startsWith('http') || path.startsWith('https')
      ? path
      : `${STORE_BASE_URL.replace(/\/$/, '')}/wp-json${path}`;

  // 处理 headers，确保类型兼容
  const baseHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...getAuthHeader(),
  };

  // 如果 init?.headers 是 Headers 对象，需要转换为普通对象
  let additionalHeaders: Record<string, string> = {};
  if (init?.headers) {
    if (init.headers instanceof Headers) {
      init.headers.forEach((value, key) => {
        additionalHeaders[key] = value;
      });
    } else if (Array.isArray(init.headers)) {
      additionalHeaders = Object.fromEntries(init.headers);
    } else {
      additionalHeaders = init.headers as Record<string, string>;
    }
  }

  const headers: HeadersInit = {
    ...baseHeaders,
    ...additionalHeaders,
  };

  const res = await fetch(url, {
    method: 'GET',
    ...init,
    headers,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('[WooCommerce] REST GET 失败', {
      url,
      status: res.status,
      body: text,
    });
    throw new Error(`WooCommerce REST 请求失败: ${res.status}`);
  }

  return (await res.json()) as T;
}

/**
 * 使用 WooCommerce Store API 获取当前会话的购物车。
 * 依赖于从 Next.js API 路由转发的 Cookie。
 */
export async function wooStoreGetCart(cookies: string | null | undefined) {
  const url = `${STORE_BASE_URL.replace(
    /\/$/,
    ''
  )}/wp-json/wc/store/cart`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(cookies ? { cookie: cookies } : {}),
    },
    cache: 'no-store',
  });

  const rawText = await res.text().catch(() => '');
  const data = rawText ? (JSON.parse(rawText) as unknown) : null;

  if (!res.ok) {
    console.error('[WooCommerce] Store API 购物车获取失败', {
      status: res.status,
      data,
    });
    const snippet =
      typeof rawText === 'string' ? rawText.slice(0, 500) : String(rawText);
    throw new Error(
      `获取 WooCommerce 购物车失败: ${res.status} ${snippet ? `- ${snippet}` : ''}`
    );
  }

  return data;
}


