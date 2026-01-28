import { NextRequest, NextResponse } from 'next/server';
import { wooRestGet } from '@/utils/woocommerce';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get('id');
  const email = searchParams.get('email');

  if (!id && !email) {
    return NextResponse.json(
      { error: '必须提供 id 或 email 其中之一' },
      { status: 400 }
    );
  }

  try {
    let customer;

    if (id) {
      customer = await wooRestGet(`/wc/v3/customers/${encodeURIComponent(id)}`);
    } else {
      const list = await wooRestGet(
        `/wc/v3/customers?email=${encodeURIComponent(email as string)}`
      );
      customer = Array.isArray(list) ? list[0] ?? null : null;
    }

    if (!customer) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(customer, { status: 200 });
  } catch (error) {
    console.error('[API] 获取用户信息失败', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer from WooCommerce' },
      { status: 500 }
    );
  }
}


