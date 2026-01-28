'use client';

import Link from 'next/link';
import { useState, FormEvent } from 'react';

// Trust badges 数据
const trustBadges = [
  {
    icon: 'https://www.camthink.ai/resource/swift-delivery.svg',
    alt: 'Fast Global Shipping',
    href: 'https://www.camthink.ai/shipping-policy/',
    text: 'Fast Global Shipping',
  },
  {
    icon: 'https://www.camthink.ai/resource/global-warranty.svg',
    alt: 'Global Warranty',
    href: 'https://www.camthink.ai/warranty-and-return-policy/',
    text: 'Global Warranty',
  },
  {
    icon: 'https://www.camthink.ai/resource/price-guarantee.svg',
    alt: '30-Day Return',
    href: 'https://www.camthink.ai/warranty-and-return-policy/',
    text: '30-Day Return',
  },
  {
    icon: 'https://www.camthink.ai/resource/lifetime-support.svg',
    alt: 'Lifetime Support',
    href: 'https://www.camthink.ai/company/contact-us/',
    text: 'Lifetime Support',
  },
];

// 社交媒体链接
const socialLinks = [
  {
    name: 'Discord',
    href: 'https://discord.com/invite/6TZb2Y8WKx',
    icon: 'https://www.camthink.ai/resource/2025/06/camthink-discord-logo2.svg',
    alt: 'Join CamThink community on Discord',
  },
  {
    name: 'Twitter',
    href: 'https://x.com/CamThinkAI',
    icon: 'https://www.camthink.ai/resource/2025/07/twitter.svg',
    alt: 'Follow CamThink on X (Twitter)',
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@CamThink',
    icon: 'https://www.camthink.ai/resource/2025/07/youtube.svg',
    alt: 'Watch CamThink videos on YouTube',
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/CamThink',
    icon: 'https://www.camthink.ai/resource/2025/07/linkin.svg',
    alt: 'Connect with CamThink on LinkedIn',
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/CamThink/',
    icon: 'https://www.camthink.ai/resource/2025/07/facebook.svg',
    alt: 'Follow CamThink on Facebook',
  },
];

// Footer 链接类型
type FooterLink = {
  name: string;
  href: string;
  external?: boolean;
};

// Footer 链接数据
const footerLinks: {
  products: FooterLink[];
  developers: FooterLink[];
  store: FooterLink[];
  company: FooterLink[];
} = {
  products: [
    { name: 'NeoEyes NE301', href: 'https://www.camthink.ai/product/ne301/' },
    { name: 'NeoEyes NE101', href: 'https://www.camthink.ai/product/neoeyes-ai-camera-ne101/' },
    { name: 'NeoEdge NG4500', href: 'https://www.camthink.ai/product/neoedge-ai-box-ng4500/' },
  ],
  developers: [
    { name: 'Wiki', href: 'https://wiki.camthink.ai/docs/', external: true },
    { name: 'GitHub', href: 'https://github.com/CamThink-AI', external: true },
    { name: 'Discord', href: 'https://discord.com/invite/6TZb2Y8WKx', external: true },
    { name: 'Blog', href: 'https://www.camthink.ai/resource/blog/' },
  ],
  store: [
    { name: 'Shop All', href: 'https://www.camthink.ai/store/' },
    { name: 'My Account', href: 'https://www.camthink.ai/my-account/' },
    { name: 'Warranty & Return', href: 'https://www.camthink.ai/warranty-and-return-policy/' },
    { name: 'Shipping Policy', href: 'https://www.camthink.ai/shipping-policy/' },
  ],
  company: [
    { name: 'About Us', href: 'https://www.camthink.ai/company/about/' },
    { name: 'Contact Us', href: 'https://www.camthink.ai/company/contact-us/' },
  ],
};

// 支付方式图标
const paymentMethods = [
  { icon: 'https://www.camthink.ai/resource/paypal.svg', alt: 'PayPal' },
  { icon: 'https://www.camthink.ai/resource/google-pay.svg', alt: 'Google Pay' },
  { icon: 'https://www.camthink.ai/resource/apple-pay.svg', alt: 'Apple Pay' },
  { icon: 'https://www.camthink.ai/resource/visa.svg', alt: 'Visa' },
  { icon: 'https://www.camthink.ai/resource/mastercard.svg', alt: 'Mastercard' },
];

// Mailchimp 配置
const MAILCHIMP_URL = 'https://camthink.us2.list-manage.com/subscribe/post-json?u=4ecc400d85930178fb49aa9de&id=466fcc3b55&f_id=00fb0ae1f0';

// 移动端手风琴组件
function MobileAccordion({ title, links }: { title: string; links: FooterLink[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-5 text-white text-2xl font-normal text-left"
      >
        <span>{title}</span>
        <svg
          className={`w-3 h-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1.5L6 6.5L11 1.5"
            stroke="#C4C4C4"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-[500px]' : 'max-h-0'
        }`}
      >
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noopener noreferrer' : undefined}
            className="block py-3 text-[#c4c4c4] text-lg font-normal border-t border-white/10 hover:text-white transition-colors"
          >
            {link.name}
          </a>
        ))}
      </div>
    </div>
  );
}

// 成功弹窗组件
function SuccessModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[10000] flex items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-lg p-12 max-w-[500px] w-[90%] relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 text-2xl leading-none"
        >
          ×
        </button>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>✔️</span>
          <span>Success! Your 10% coupon is on the way.</span>
        </h2>
        <p className="text-base text-gray-600 mb-8 leading-relaxed">
          Please check your inbox — your welcome coupon will arrive in 1–2 minutes.
        </p>
        <div className="flex flex-col gap-4">
          <a
            href="https://www.camthink.ai/store/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3.5 px-6 bg-[#f24a00] text-white rounded font-semibold hover:bg-[#d43d00] transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.15.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
            Shop Now
          </a>
          <a
            href="https://discord.com/invite/6TZb2Y8WKx"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3.5 px-6 bg-[#f2f2f2] text-gray-800 rounded font-semibold hover:bg-[#e0e0e0] transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.007-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            Join our Discord
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!email || !isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const callbackName = `mailchimp_callback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const url = `${MAILCHIMP_URL}&EMAIL=${encodeURIComponent(email)}&tags=1053228&c=${callbackName}`;

      // 使用 JSONP 方式提交
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        (window as any)[callbackName] = (data: any) => {
          delete (window as any)[callbackName];
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }

          if (data.result === 'success') {
            setEmail('');
            setShowSuccessModal(true);
            // Google Analytics 埋点
            if (typeof (window as any).gtag !== 'undefined') {
              (window as any).gtag('event', 'newsletter_success', {
                event_category: 'newsletter',
                event_label: 'newsletter_success',
              });
            }
            resolve();
          } else {
            setError(data.msg || 'Something went wrong. Please try again.');
            reject(new Error(data.msg));
          }
        };

        script.onerror = () => {
          delete (window as any)[callbackName];
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }
          setError('Network error. Please try again.');
          reject(new Error('Network error'));
        };

        script.src = url;
        document.body.appendChild(script);
      });
    } catch (err) {
      // Error already handled in promise
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer
        className="w-full bg-[#141414] border-t border-white/40 relative"
        style={{
          backgroundImage: 'url("https://www.camthink.ai/resource/2025/07/camthink-vision-ai-logo-white5.jpg")',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'bottom center',
          backgroundSize: 'contain',
        }}
      >
        <div className="container mx-auto px-4 md:px-11 mt-8 md:mt-16">
          {/* Trust Badges */}
          <ul className="grid grid-cols-2 md:flex md:justify-between items-center gap-4 md:gap-16 max-w-[1000px] mx-auto mb-8 list-none">
            {trustBadges.map((badge) => (
              <li key={badge.href} className="flex flex-col items-center gap-4">
                <img src={badge.icon} alt={badge.alt} className="w-[38px] h-[38px]" loading="lazy" />
                <a
                  href={badge.href}
                  className="text-lg font-normal text-[#c4c4c4] text-center no-underline hover:underline"
                >
                  {badge.text}
                </a>
              </li>
            ))}
          </ul>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row justify-start items-start gap-16 flex-wrap mb-8">
            {/* Left Section - Logo, Description, Email, Social */}
            <div className="w-full lg:w-auto lg:mr-auto">
              <img
                src="https://www.camthink.ai/resource/2025/06/camthink-vision-ai-logo.svg"
                alt="CamThink brand logo"
                className="w-48 mb-4"
                loading="lazy"
              />
              <p className="text-lg font-normal text-white my-4">
                Open-source Edge AI Hardware for Developers & Teams
              </p>

              {/* Email Subscription */}
              <div className="mt-10">
                <form onSubmit={handleSubmit} className="relative w-full max-w-[400px]">
                  <div className="relative bg-[#f2f2f2]">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full h-[50px] px-2.5 py-2.5 pr-[105px] bg-[#f2f2f2] border-0 rounded-none focus:outline-none focus:border-0"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="absolute right-[5px] top-[5px] w-[100px] h-10 bg-[#f24a00] text-white border-0 rounded-none cursor-pointer hover:bg-[#ef713a] transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? 'Submitting...' : 'Subscribe'}
                    </button>
                  </div>
                  {error && (
                    <p className="mt-4 text-sm text-[#f24a00]">{error}</p>
                  )}
                </form>
              </div>

              {/* Social Links */}
              <div className="flex gap-[18px] mt-10">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-[38px] h-[38px] border border-[#434343] flex items-center justify-center hover:opacity-80 transition-opacity"
                  >
                    <img
                      src={social.icon}
                      alt={social.alt}
                      className="w-[30px] h-[30px] mt-1"
                      loading="lazy"
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Desktop Links - Products */}
            <ul className="hidden lg:flex flex-col gap-3.5 list-none">
              <li className="text-2xl font-semibold text-white mb-0">Products</li>
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-lg font-normal text-[#c4c4c4] no-underline hover:underline"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Desktop Links - Developers */}
            <ul className="hidden lg:flex flex-col gap-3.5 list-none">
              <li className="text-2xl font-semibold text-white mb-0">Developers</li>
              {footerLinks.developers.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="text-lg font-normal text-[#c4c4c4] no-underline hover:underline"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Desktop Links - Store */}
            <ul className="hidden lg:flex flex-col gap-3.5 list-none">
              <li className="text-2xl font-semibold text-white mb-0">Store</li>
              {footerLinks.store.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-lg font-normal text-[#c4c4c4] no-underline hover:underline"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Desktop Links - Company */}
            <ul className="hidden lg:flex flex-col gap-3.5 list-none">
              <li className="text-2xl font-semibold text-white mb-0">Company</li>
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-lg font-normal text-[#c4c4c4] no-underline hover:underline"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile Accordion */}
          <div className="lg:hidden mt-4">
            <MobileAccordion title="Products" links={footerLinks.products} />
            <MobileAccordion title="Developers" links={footerLinks.developers} />
            <MobileAccordion title="Store" links={footerLinks.store} />
            <MobileAccordion title="Company" links={footerLinks.company} />
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8 pb-8 mt-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-lg text-[#c4c4c4] mb-0 order-2 md:order-1 text-center md:text-left">
                © {currentYear} CamThink.ai All rights reserved.
              </p>
              <div className="flex flex-col items-center md:items-end gap-4 order-1 md:order-2 w-full md:w-auto">
                {/* Payment Methods */}
                <ul className="flex gap-1.5 list-none">
                  {paymentMethods.map((method) => (
                    <li key={method.alt} className="w-[38px] h-[38px]">
                      <img
                        src={method.icon}
                        alt={method.alt}
                        className="w-full h-full"
                        loading="lazy"
                      />
                    </li>
                  ))}
                </ul>
                {/* Legal Links */}
                <div className="flex items-center gap-2">
                  <a
                    href="https://www.camthink.ai/terms-of-service/"
                    className="text-lg text-[#c4c4c4] no-underline hover:underline"
                  >
                    Terms of Service
                  </a>
                  <span className="text-[#c4c4c4]">|</span>
                  <a
                    href="https://www.camthink.ai/privacy-policy/"
                    className="text-lg text-[#c4c4c4] no-underline hover:underline"
                  >
                    Privacy Policy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Success Modal */}
      <SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
    </>
  );
}
