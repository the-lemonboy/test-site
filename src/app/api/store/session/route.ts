import { NextRequest, NextResponse } from 'next/server';

function parseWpUsernameFromCookie(cookieHeader: string | null) {
  if (!cookieHeader) return null;

  // WP 登录 Cookie 形如：wordpress_logged_in_<hash>=username|expiration|token|hmac
  const match = cookieHeader.match(/(?:^|;\s*)(wordpress_logged_in_[^=]+)=([^;]+)/);
  if (!match) return null;

  const rawValue = match[2] ?? '';
  // 可能是 URL 编码（%7C）
  const decoded = decodeURIComponent(rawValue);
  const username = decoded.split('|')[0]?.trim();
  return username || null;
}

function parseWooCartCountFromCookie(cookieHeader: string | null) {
  if (!cookieHeader) return 0;

  // WooCommerce 会设置 woocommerce_items_in_cart 保存购物车商品数量
  const match = cookieHeader.match(/(?:^|;\s*)woocommerce_items_in_cart=([^;]+)/);
  if (!match) return 0;

  const raw = decodeURIComponent(match[1] ?? '').trim();
  const n = Number(raw);
  if (Number.isNaN(n) || n < 0) return 0;
  return n;
}

export async function GET(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get('cookie');
    console.log('[API][session] 原始 Cookie header:', cookieHeader);

    const cartCount = parseWooCartCountFromCookie(cookieHeader);
    const username = parseWpUsernameFromCookie(cookieHeader);

    console.log('[API][session] 解析结果:', {
      username,
      cartCount,
    });

    return NextResponse.json(
      {
        username,
        cartCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API] 获取会话信息失败', error);
    return NextResponse.json(
      { error: 'Failed to fetch session info from WooCommerce' },
      { status: 500 }
    );
  }
}


