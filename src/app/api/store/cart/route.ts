import { NextRequest, NextResponse } from 'next/server';
import { wooStoreGetCart } from '@/utils/woocommerce';

export async function GET(req: NextRequest) {
  try {
    const cookies = req.headers.get('cookie');
    const cart = await wooStoreGetCart(cookies);

    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    console.error('[API] 获取购物车失败', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart from WooCommerce' },
      { status: 500 }
    );
  }
}


