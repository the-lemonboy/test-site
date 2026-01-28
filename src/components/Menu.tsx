'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type ProductCard = {
  title: string;
  desc: string;
  href: string;
  tag?: string;
};

type SimpleItem = {
  label: string;
  href: string;
};

type NavGroup =
  | {
      type: 'products';
      label: string;
      items: ProductCard[];
    }
  | {
    type: 'links';
    label: string;
    items: SimpleItem[];
  };

const productCards: ProductCard[] = [
  {
    title: 'NeoEyes NE301',
    desc: 'Edge AI camera · STM32N6 · 0.6 TOPS @ 3 TOPS/W',
    href: 'https://www.camthink.ai/product/neoeyes-301/',
    tag: 'New',
  },
  {
    title: 'NeoEyes NE101',
    desc: 'Modular vision camera · ESP32-S3 · IP67 · Swappable I/O',
    href: 'https://www.camthink.ai/product/neoeyes-ai-camera-ne101/',
    tag: 'New',
  },
  {
    title: 'NE100-MB01 Dev Board',
    desc: 'ESP32-S3 dev board · event-based capture · Wi-Fi + BLE',
    href: 'https://www.camthink.ai/store/neoeye-esp32-vision-dev-board/',
  },
  {
    title: 'NeoEdge NG4500',
    desc: 'Edge AI Box · Run YOLOv5/DeepStream · Smart city / IIoT',
    href: 'https://www.camthink.ai/store/neoedge-ai-box/',
  },
];

const navGroups: NavGroup[] = [
  { type: 'products', label: '产品', items: productCards },
  {
    type: 'links',
    label: '解决方案',
    items: [
      { label: '智慧城市', href: '/solutions/city' },
      { label: '工业视觉', href: '/solutions/industry' },
      { label: '零售分析', href: '/solutions/retail' },
    ],
  },
  {
    type: 'links',
    label: '开发者',
    items: [
      { label: '开发者中心', href: 'https://www.camthink.ai/developer-center/' },
      { label: '文档', href: '/docs' },
      { label: '社区 Discord', href: 'https://discord.com/invite/6TZb2Y8WKx' },
    ],
  },
  {
    type: 'links',
    label: '关于我们',
    items: [
      { label: '公司介绍', href: '/company' },
      { label: '新闻与博客', href: '/blog' },
      { label: '联系我们', href: '/contact' },
    ],
  },
];

const topLinks: SimpleItem[] = [
  { label: '首页', href: '/' },
  { label: '商城', href: 'https://www.camthink.ai/store/' },
];

export default function Menu() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // 禁止背景滚动，保持与 PHP 版本相似的覆盖体验
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const mobileNav = useMemo(
    () => [...topLinks, ...navGroups.map((g) => ({ label: g.label, href: `#${g.label}` }))],
    []
  );

  // 加载 WooCommerce 会话信息（用户名 + 购物车数量）
  useEffect(() => {
    let aborted = false;

    const loadSession = async () => {
      try {
        const res = await fetch('/api/store/session', {
          credentials: 'include',
        });
        if (!res.ok) return;
        const data = await res.json();
        if (aborted || !data) return;
        const count = typeof data.cartCount === 'number' ? data.cartCount : 0;
        setCartCount(count);

        // 按你的需求：在浏览器控制台打印（用户名、购物车数量）
        // eslint-disable-next-line no-console
        console.log('[Woo Session]', {
          username: data.username ?? null,
          cartCount: count,
        });
      } catch {
        // 静默失败，不阻塞导航
      }
    };

    loadSession();

    return () => {
      aborted = true;
    };
  }, []);

  const closeAll = () => {
    setActiveDropdown(null);
    setMobileOpen(false);
    setMobileSubmenu(null);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#161616]/95 backdrop-blur border-b border-[#1f1f1f]'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-xl font-semibold text-white hover:text-[#f24a00] transition-colors"
            onClick={closeAll}
          >
            CamThink
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6 text-sm">
            {topLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-200 hover:text-[#f24a00] transition-colors"
              >
                {item.label}
              </Link>
            ))}

            {navGroups.map((group) => (
              <div
                key={group.label}
                className="relative"
                onMouseEnter={() => setActiveDropdown(group.label)}
                onMouseLeave={() => setActiveDropdown((cur) => (cur === group.label ? null : cur))}
              >
                <button
                  className={`inline-flex items-center gap-1 font-medium transition-colors ${
                    activeDropdown === group.label ? 'text-[#f24a00]' : 'text-gray-100'
                  }`}
                >
                  {group.label}
                  <span className="text-xs">▼</span>
                </button>

                {/* Dropdown */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 pt-4 transition-all duration-200 ${
                    activeDropdown === group.label
                      ? 'opacity-100 pointer-events-auto'
                      : 'opacity-0 pointer-events-none'
                  }`}
                >
                  {group.type === 'products' ? (
                    <div className="grid grid-cols-2 gap-4 rounded-xl bg-[#1e1e1e] p-5 shadow-2xl min-w-[520px] border border-[#262626]">
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex flex-col gap-2 rounded-lg border border-transparent bg-[#242424] p-4 hover:border-[#f24a00] hover:shadow-lg transition-all"
                          onClick={closeAll}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base font-semibold text-white">
                              {item.title}
                            </span>
                            {item.tag ? (
                              <span className="rounded-full bg-[#f24a00] px-2 py-0.5 text-[10px] font-semibold text-white">
                                {item.tag}
                              </span>
                            ) : null}
                          </div>
                          <p className="text-sm text-gray-300 leading-relaxed">{item.desc}</p>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="min-w-[220px] rounded-lg bg-[#1e1e1e] p-3 shadow-2xl border border-[#262626]">
                      <div className="flex flex-col">
                        {group.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-gray-100 hover:bg-[#262626] hover:text-[#f24a00] transition-colors"
                            onClick={closeAll}
                          >
                            <span>{item.label}</span>
                            <span className="text-xs text-gray-500">›</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="flex items-center gap-4">
              <Link
                href="https://www.camthink.ai/store/"
                className="rounded-full bg-[#f24a00] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                前往商店
              </Link>
              <Link
                href="https://www.camthink.ai/cart/"
                className="relative inline-flex items-center justify-center h-9 w-9 rounded-full border border-[#2d2d2d] text-gray-100 hover:border-[#f24a00] hover:text-[#f24a00] transition-colors"
                aria-label="查看购物车"
              >
                <span className="text-lg">🛒</span>
                {cartCount && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full bg-[#f24a00] px-1 text-[10px] leading-4 text-center text-white">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </nav>

          {/* Mobile button + cart */}
          <div className="lg:hidden flex items-center gap-3">
            <Link
              href="https://www.camthink.ai/cart/"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#2d2d2d] text-gray-100"
              aria-label="查看购物车"
            >
              <span className="text-lg">🛒</span>
              {cartCount && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full bg-[#f24a00] px-1 text-[10px] leading-4 text-center text-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#2d2d2d] text-gray-100"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="打开菜单"
            >
              {mobileOpen ? <span className="text-lg">✕</span> : <span className="text-lg">☰</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeAll}
      />

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed top-0 right-0 bottom-0 w-[82%] max-w-sm bg-[#1f1f1f] shadow-2xl transform transition-transform duration-250 ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 h-14 border-b border-[#2a2a2a]">
          <Link href="/" className="text-lg font-semibold text-white" onClick={closeAll}>
            CamThink
          </Link>
          <button
            className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-[#2d2d2d] text-gray-100"
            onClick={closeAll}
            aria-label="关闭菜单"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-56px)]">
          <div className="p-4 space-y-2">
            {mobileNav.map((item) => {
              const group = navGroups.find((g) => g.label === item.label);
              const isSubmenu = mobileSubmenu === item.label;

              if (group) {
                return (
                  <div
                    key={group.label}
                    className="rounded-lg border border-[#2a2a2a] bg-[#252525]"
                  >
                    <button
                      className="flex w-full items-center justify-between px-4 py-3 text-left text-white"
                      onClick={() =>
                        setMobileSubmenu((cur) => (cur === group.label ? null : group.label))
                      }
                    >
                      <span>{group.label}</span>
                      <span className="text-sm">{isSubmenu ? '▲' : '▼'}</span>
                    </button>
                    <div
                      className={`transition-all duration-200 ${
                        isSubmenu ? 'max-h-[560px] opacity-100' : 'max-h-0 opacity-0'
                      } overflow-hidden`}
                    >
                      {group.type === 'products' ? (
                        <div className="grid grid-cols-1 gap-3 px-4 pb-4">
                          {group.items.map((card) => (
                            <Link
                              key={card.href}
                              href={card.href}
                              className="rounded-lg border border-[#2d2d2d] bg-[#2b2b2b] p-3 text-white hover:border-[#f24a00] transition-colors"
                              onClick={closeAll}
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{card.title}</span>
                                {card.tag ? (
                                  <span className="rounded-full bg-[#f24a00] px-2 py-0.5 text-[10px] font-semibold text-white">
                                    {card.tag}
                                  </span>
                                ) : null}
                              </div>
                              <p className="mt-2 text-sm text-gray-300 leading-relaxed">
                                {card.desc}
                              </p>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col px-2 pb-2">
                          {group.items.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              className="rounded-md px-3 py-2 text-sm text-white hover:bg-[#2d2d2d] hover:text-[#f24a00] transition-colors"
                              onClick={closeAll}
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-lg border border-[#2a2a2a] bg-[#252525] px-4 py-3 text-white hover:border-[#f24a00] transition-colors"
                  onClick={closeAll}
                >
                  {item.label}
                </Link>
              );
            })}

            <Link
              href="https://www.camthink.ai/store/"
              className="block rounded-full bg-[#f24a00] px-4 py-3 text-center text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              onClick={closeAll}
            >
              前往商店
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

