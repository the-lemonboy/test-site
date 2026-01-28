"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import type { KeyboardEvent } from "react";

declare global {
  interface Window {
    Swiper: new (selector: string | Element, options?: Record<string, unknown>) => {
      destroy: (deleteInstance?: boolean, cleanStyles?: boolean) => void;
    };
  }
}

export default function Home() {
  const [swiperReady, setSwiperReady] = useState(false);
  
  // 只在客户端访问 document
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('Home', document.cookie);
    }
  }, []);

  const handleCardClick = (url: string) => () => {
    window.open(url, "_blank");
  };

  const handleCardKeyDown =
    (url: string) => (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        window.open(url, "_blank");
      }
    };

  useEffect(() => {
    if (!swiperReady || typeof window === "undefined") {
      return;
    }

    let heroInstance: {
      destroy: (deleteInstance?: boolean, cleanStyles?: boolean) => void;
    } | null = null;
    let mobileInstance: {
      destroy: (deleteInstance?: boolean, cleanStyles?: boolean) => void;
    } | null = null;
    const hoverCleanupFns: Array<() => void> = [];
    let heroCtaCleanup: (() => void) | null = null;

    const cleanupHoverEffects = () => {
      hoverCleanupFns.forEach((remove) => remove());
      hoverCleanupFns.length = 0;
    };

    const setupHoverEffects = () => {
      cleanupHoverEffects();
      if (window.innerWidth < 1200) {
        return;
      }

      const registerHover = (element?: HTMLElement | null) => {
        if (!element) return;
        const onEnter = () => {
          element.style.transform = "translateY(-1.6875rem)";
          element.style.borderStyle = "solid";
          element.style.borderWidth = "2px";
          element.style.borderImageSource =
            "linear-gradient(0deg,#f04a06 0%, #ffffff 100%)";
          element.style.borderImageSlice = "1";
        };
        const onLeave = () => {
          element.style.transform = "translateY(0)";
          element.style.borderStyle = "none";
        };
        element.addEventListener("mouseenter", onEnter);
        element.addEventListener("mouseleave", onLeave);
        hoverCleanupFns.push(() => {
          element.removeEventListener("mouseenter", onEnter);
          element.removeEventListener("mouseleave", onLeave);
        });
      };

      registerHover(document.querySelector<HTMLElement>(".s1 .left"));
      registerHover(document.querySelector<HTMLElement>(".s1 .right"));
    };

    const initHeroSwiper = () => {
      if (heroInstance || !window.Swiper) {
        return;
      }
      heroInstance = new window.Swiper(".hero-swiper", {
        lazy: {
          loadPrevNext: true,
        },
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        speed: 800,
        loop: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });
    };

    const initMobileSwiper = () => {
      if (mobileInstance || !window.Swiper) {
        return;
      }
      mobileInstance = new window.Swiper(".mobile-hero-swiper", {
        lazy: {
          loadPrevNext: true,
        },
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        speed: 800,
        loop: true,
      });
    };

    const toggleSwipers = () => {
      const heroSection = document.querySelector<HTMLElement>(".hero-swiper");
      const mobileSection = document.querySelector<HTMLElement>(
        ".mb-header-section"
      );
      if (!heroSection || !mobileSection) {
        return;
      }

      if (window.innerWidth < 1200) {
        heroSection.style.display = "none";
        mobileSection.style.display = "block";
        initMobileSwiper();
      } else {
        heroSection.style.display = "block";
        mobileSection.style.display = "none";
        initHeroSwiper();
      }
    };

    const attachHeroCta = () => {
      const heroFormBtn = document.querySelector<HTMLAnchorElement>(
        ".go-form-section .btn-text"
      );
      if (!heroFormBtn) {
        return;
      }

      const handleClick = (event: Event) => {
        const contactSection = document.querySelector("#contact");
        if (!contactSection) {
          return;
        }

        event.preventDefault();
        const headerOffset = 90;
        const elementPosition =
          contactSection.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset + 850;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      };

      heroFormBtn.addEventListener("click", handleClick);
      heroCtaCleanup = () => {
        heroFormBtn.removeEventListener("click", handleClick);
      };
    };

    const handleResize = () => {
      toggleSwipers();
      setupHoverEffects();
    };

    toggleSwipers();
    setupHoverEffects();
    attachHeroCta();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cleanupHoverEffects();
      heroCtaCleanup?.();
      heroInstance?.destroy?.(true, true);
      mobileInstance?.destroy?.(true, true);
    };
  }, [swiperReady]);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"
        strategy="afterInteractive"
        onLoad={() => setSwiperReady(true)}
      />
      <Script
        src="https://js-na2.hsforms.net/forms/embed/242960357.js"
        strategy="lazyOnload"
      />
      <main className="main-container">
        <div className="hero swiper hero-swiper">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <picture>
                <source
                  srcSet="https://www.camthink.ai/resource/banner_neoeyes_ne301_early_access3-webp.webp"
                  type="image/webp"
                />
                <img
                  src="https://www.camthink.ai/resource/banner_neoeyes_ne301_early_access3.png"
                  alt="CamThink NeoEyes NE301 banner"
                  className="hero-bg"
                  loading="lazy"
                />
              </picture>
              <div className="hero-content">
                <div className="content-box">
                  <h1 className="ne301-title">NeoEyes NE301</h1>
                  <h2 className="ne301-subtitle">
                    Ultra-Low Power Edge AI Camera
                  </h2>
                  <p className="ne301-text">Built on STM32N6</p>
                  <div className="ne301-spec-box">
                    <div className="ne301-spec-item">
                      <img
                        src="https://www.camthink.ai/resource/icon_vision_ai_banner.svg"
                        alt="Real-time Vision AI"
                      />
                      <p className="ne301-spec-item-text">Real-time Vision AI</p>
                    </div>
                    <div className="ne301-spec-item">
                      <img
                        src="https://www.camthink.ai/resource/icon_performance_banner.svg"
                        alt="Multi-mode Performance"
                      />
                      <p className="ne301-spec-item-text">
                        Multi-mode Performance
                      </p>
                    </div>
                    <div className="ne301-spec-item">
                      <img
                        src="https://www.camthink.ai/resource/icon_modular_banner.svg"
                        alt="Modular by Design"
                      />
                      <p className="ne301-spec-item-text">Modular by Design</p>
                    </div>
                    <div className="ne301-spec-item">
                      <img
                        src="https://www.camthink.ai/resource/icon_ip67_banner.svg"
                        alt="IP67 Outdoor-ready"
                      />
                      <p className="ne301-spec-item-text">IP67 Outdoor-ready</p>
                    </div>
                  </div>
                  <a
                    href="https://www.camthink.ai/product/neoeyes-301/"
                    className="ne301-buy-btn hero-btn"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="banner-btn-text">
                      Learn More
                      <span className="banner-btn-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1.2em"
                          height="1.2em"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill="#fff"
                            fillRule="evenodd"
                            d="m10.207 8-3.854 3.854-.707-.707L8.793 8 5.646 4.854l.707-.708z"
                            clipRule="evenodd"
                            strokeWidth="0.5"
                            stroke="#fff"
                          />
                        </svg>
                      </span>
                    </span>
                  </a>
                  <p className="ne301-desc">Shipping will start from Dec 5.</p>
                </div>
              </div>
            </div>
            <div className="swiper-slide">
              <picture>
                <source
                  srcSet="https://www.camthink.ai/resource/banner-webp.webp"
                  type="image/webp"
                />
                <img
                  src="https://www.camthink.ai/resource/2025/06/banner.jpg"
                  alt="CamThink abstract banner"
                  className="hero-bg"
                  loading="lazy"
                />
              </picture>
              <div className="hero-content">
                <div className="content-box">
                  <h1 className="hero-title">Accelerating Vision AI Innovations</h1>
                  <p className="hero-subtitle">
                    Enabling{" "}
                    <span style={{ color: "#f24a00" }}>
                      developers, engineers, and makers
                    </span>{" "}
                    to efficiently Develop custom, production-ready AI models for
                    diverse real-world applications.
                  </p>
                  <a href="#contact" className="btn-text hero-btn">
                    Get Early Access
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="swiper-pagination" />
          <div className="swiper-button-prev swiper-btn" />
          <div className="swiper-button-next swiper-btn" />
        </div>

        <div className="mb-header-section">
          <div className="mobile-hero-swiper swiper">
            <div className="swiper-wrapper">
              <div className="swiper-slide">
                <picture>
                  <source
                    srcSet="https://www.camthink.ai/resource/banner_neoeyes_ne301_early_access2_m.jpg"
                    type="image/webp"
                  />
                  <img
                    src="https://www.camthink.ai/resource/2025/06/banner.jpg"
                    alt="CamThink mobile banner"
                    className="hero-bg"
                    loading="lazy"
                  />
                </picture>
                <div className="mobile-hero-content ne301-content">
                  <h2 className="mb-title">NeoEyes NE301</h2>
                  <p className="mb-subtitle">Ultra-Low Power Edge AI Camera</p>
                  <p className="mb-text">
                    Built on <span style={{ color: "#f24a00" }}>STM32N6</span>
                  </p>
                  <div className="mb-btn">
                    <a
                      href="https://www.camthink.ai/product/neoeyes-301/"
                      className="btn-text"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Learn More
                      <span className="banner-btn-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1.2em"
                          height="1.2em"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill="#fff"
                            fillRule="evenodd"
                            d="m10.207 8-3.854 3.854-.707-.707L8.793 8 5.646 4.854l.707-.708z"
                            clipRule="evenodd"
                            strokeWidth="0.5"
                            stroke="#fff"
                          />
                        </svg>
                      </span>
                    </a>
                  </div>
                  <p className="mb-text">Shipping will start from Dec 5.</p>
                </div>
              </div>
              <div className="swiper-slide mobile-hero-content go-form-section">
                <h2 className="mb-title">
                  Accelerating Vision <br /> AI Innovations
                </h2>
                <p className="mb-subtitle">
                  Enabling{" "}
                  <span style={{ color: "#f24a00", fontWeight: 600 }}>
                    developers, engineers, and makers
                  </span>{" "}
                  to efficiently develop <br />
                  custom, production-ready AI models for diverse real-world
                  applications.
                </p>
                <div className="mb-btn">
                  <a href="#contact" className="btn-text">
                    Get Early Access
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="containers">
          <div className="s1">
            <div className="content">
              <div className="left s1-item ne101-item">
                <picture>
                  <source
                    srcSet="https://www.camthink.ai/resource/ne101_modular_vision_camera_m-webp-1.webp"
                    type="image/webp"
                  />
                  <img
                    className="s1-item-img"
                    src="https://www.camthink.ai/resource/ne101_modular_vision_camera_m.jpg"
                    alt="CamThink NeoEyes NE101 modular vision camera"
                    loading="lazy"
                  />
                </picture>
                <div className="text-container">
                  <picture>
                    <img
                      className="s1-pc-bg-img"
                      src="https://www.camthink.ai/resource/ne101_modular_vision_camera.jpg"
                      alt="CamThink NeoEyes NE101 modular vision camera"
                      loading="lazy"
                    />
                  </picture>
                  <div className="s1-item-content">
                    <h2 className="title">Modular Vision Camera</h2>
                    <p className="sub-title">NeoEyes NE101</p>
                    <p className="text1">Swappable · Low-Power · IoT Ready</p>
                    <ul className="text2">
                      <li>Replaceable lenses and flexible I/O</li>
                      <li>Wi-Fi Halow / Cat.1 communication options</li>
                      <li>IP67 housing for outdoor environments</li>
                    </ul>
                  </div>
                  <div className="btn-wrap">
                    <a
                      href="https://www.camthink.ai/product/neoeyes-ai-camera-ne101/"
                      className="btn"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Learn More
                    </a>
                  </div>
                </div>
              </div>

              <div className="right s1-item ne301-item">
                <picture>
                  <source
                    srcSet="https://www.camthink.ai/resource/ne301_modular_vision_camera_m-webp.webp"
                    type="image/webp"
                  />
                  <img
                    className="s1-item-img"
                    src="https://www.camthink.ai/resource/ne301_edge_vision_ai_camera_m.jpg"
                    alt="CamThink NeoEyes NE301 Edge AI camera"
                    loading="lazy"
                  />
                </picture>
                <div className="text-container ne301-text-container">
                  <div className="pre-order-badge" aria-hidden="true" />
                  <picture>
                    <source
                      srcSet="https://www.camthink.ai/resource/ne301_modular_vision_camera-webp.webp"
                      type="image/webp"
                    />
                    <img
                      className="s1-pc-bg-img"
                      src="https://www.camthink.ai/resource/ne301_edge_vision_ai_camera.jpg"
                      alt="CamThink NeoEyes NE301 Edge AI camera"
                      loading="lazy"
                    />
                  </picture>
                  <div className="s1-item-content">
                    <h2 className="title">Edge AI Camera</h2>
                    <p className="sub-title">NeoEyes NE301</p>
                    <p className="text1">
                      Ultra-Low Power · 0.6 TOPS @ 3 TOPS/W · On-Device AI
                    </p>
                    <ul className="text2">
                      <li>STM32N6 MCU with integrated NPU</li>
                      <li>Run YOLO / MobileNet directly</li>
                      <li>Open SDK & modular I/O for rapid prototyping</li>
                    </ul>
                  </div>
                </div>
                <div className="btn-wrap">
                  <a
                    href="https://www.camthink.ai/product/neoeyes-301/"
                    className="btn"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="s2">
            <div className="content">
              <h2 className="section-title">New Products</h2>
              <a
                href="https://www.camthink.ai/store/"
                className="more"
                target="_blank"
                rel="noreferrer"
              >
                Shop More &gt;
              </a>
              <div className="products-list">
                <div
                  className="index-product-item"
                  onClick={handleCardClick(
                    "https://www.camthink.ai/store/ne301/"
                  )}
                  role="button"
                  tabIndex={0}
                  onKeyDown={handleCardKeyDown(
                    "https://www.camthink.ai/store/ne301/"
                  )}
                >
                  <div
                    className="index-product-img-box"
                    style={{ overflow: "hidden" }}
                  >
                    <img
                      className="index-product-img"
                      src="https://www.camthink.ai/resource/ne301-edge-vision-ai-camera-npu.jpg"
                      alt="NeoEyes NE301 Edge AI Camera"
                      loading="lazy"
                    />
                  </div>
                  <div className="product-tag">Pre-Order</div>
                  <div className="product-content">
                    <h4 className="title">
                      <a
                        href="https://www.camthink.ai/product/neoeyes-301/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        NeoEyes NE301 Edge AI Camera
                      </a>
                    </h4>
                    <p className="text">
                      NE301 —— Tiny, ultra-efficient Edge AI camera that runs
                      YOLO on-device, wakes instantly, and powers real-world
                      vision AI anywhere — modular, battery-powered, and fully
                      open.
                    </p>
                    <div className="price-add-box">
                      <p className="price">$199.90</p>
                    </div>
                  </div>
                </div>

                <div
                  className="index-product-item"
                  onClick={handleCardClick(
                    "https://www.camthink.ai/store/neoeyes-ne101/"
                  )}
                  role="button"
                  tabIndex={0}
                  onKeyDown={handleCardKeyDown(
                    "https://www.camthink.ai/store/neoeyes-ne101/"
                  )}
                >
                  <div
                    className="index-product-img-box"
                    style={{ overflow: "hidden", cursor: "pointer" }}
                  >
                    <img
                      className="index-product-img"
                      src="https://www.camthink.ai/resource/2025/06/ne101-ai-camera.jpg"
                      alt="NeoEyes NE101 ESP32-S3 Vision AI camera"
                      loading="lazy"
                    />
                  </div>
                  <div className="product-tag">New</div>
                  <div className="product-content">
                    <h4 className="title">
                      <a
                        href="https://www.camthink.ai/store/neoeyes-ne101/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        NeoEyes NE101 Sensing Camera
                      </a>
                    </h4>
                    <p className="text">
                      Low-Power | Event-based image capture | ESP32-S3 | Wi-Fi +
                      BLE connectivity
                    </p>
                    <div className="price-add-box">
                      <p className="price">$69.90 - $112.00</p>
                    </div>
                  </div>
                </div>

                <div
                  className="index-product-item mobile-hidden"
                  onClick={handleCardClick(
                    "https://www.camthink.ai/store/neoeye-esp32-vision-dev-board/"
                  )}
                  role="button"
                  tabIndex={0}
                  onKeyDown={handleCardKeyDown(
                    "https://www.camthink.ai/store/neoeye-esp32-vision-dev-board/"
                  )}
                >
                  <picture className="index-product-img-box">
                    <source
                      srcSet="https://www.camthink.ai/resource/2025/09/NE101-dev-board-webp.webp"
                      type="image/webp"
                    />
                    <img
                      className="index-product-img"
                      src="https://www.camthink.ai/resource/2025/07/NE101-dev-board.png"
                      alt="NE100-MB01 developer board"
                      loading="lazy"
                    />
                  </picture>
                  <div className="product-tag">New</div>
                  <div className="product-content">
                    <h4 className="title" style={{ marginBottom: "2.625rem" }}>
                      <a
                        href="https://www.camthink.ai/store/neoeye-esp32-vision-dev-board/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        NE100-MB01 Dev Board
                      </a>
                    </h4>
                    <p className="text">
                      Powered by ESP32-S3, the NE101 Mainboard is the heart of
                      your event-based vision system — made for remote,
                      low-power, and highly customizable AIoT deployments.
                    </p>
                    <div className="price-add-box">
                      <p className="price">$29.90</p>
                    </div>
                  </div>
                </div>

                <div
                  className="index-product-item"
                  onClick={handleCardClick(
                    "https://www.camthink.ai/store/neoedge-ai-box/"
                  )}
                  role="button"
                  tabIndex={0}
                  onKeyDown={handleCardKeyDown(
                    "https://www.camthink.ai/store/neoedge-ai-box/"
                  )}
                >
                  <div
                    className="index-product-img-box"
                    style={{ cursor: "pointer" }}
                  >
                    <picture className="index-product-img-box">
                      <source
                        srcSet="https://www.camthink.ai/resource/2025/09/NG4500-ai-box-webp.webp"
                        type="image/webp"
                      />
                      <img
                        className="index-product-img"
                        src="https://www.camthink.ai/resource/2025/07/NG4500-ai-box.png"
                        alt="NeoEdge NG4500 AI Box"
                        loading="lazy"
                      />
                    </picture>
                  </div>
                  <div className="product-tag">New</div>
                  <div className="product-content">
                    <h4 className="title" style={{ marginBottom: "2.625rem" }}>
                      <a
                        href="https://www.camthink.ai/store/neoedge-ai-box/?v=2fd6a1a6284a"
                        target="_blank"
                        rel="noreferrer"
                      >
                        NeoEdge NG4500 AI Box
                      </a>
                    </h4>
                    <p className="text">
                      Real-Time Vision AI at the Edge Run YOLOv5, Deepstream, and
                      custom models out of the box Ideal for smart city,
                      industrial inspection, and robotics development
                    </p>
                    <div className="price-add-box">
                      <p className="price">$899.00 - $1,599.00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="s4">
            <picture>
              <source
                srcSet="https://www.camthink.ai/resource/2025/09/camthink_developer_center-webp.webp"
                type="image/webp"
              />
              <img
                className="s4-bg"
                src="https://www.camthink.ai/resource/2025/07/camthink_developer_center.jpg"
                alt="CamThink Developer Center resources"
                loading="lazy"
              />
            </picture>
            <div className="content">
              <h2 className="title">Resources and Support for Developers</h2>
              <p className="text">
                Discover detailed guides, comprehensive technical docs, and an
                engaged community for innovative discussions.
              </p>
              <a
                className="btn"
                href="https://www.camthink.ai/developer-center/"
                target="_blank"
                rel="noreferrer"
              >
                Explore Developer Center
              </a>
            </div>
          </div>

          <div className="s3">
            <div className="content">
              <div className="left">
                <h2 className="title">Vision AI Innovation</h2>
                <p className="text">
                  Empower your projects with easy integration and endless
                  possibilities.
                </p>
                <a
                  className="btn"
                  href="https://www.camthink.ai/company/about-us/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Learn More
                </a>
              </div>
              <div className="right">
                <div className="row">
                  <div className="row-item">
                    <img
                      src="https://www.camthink.ai/resource/2025/06/Icon1.png"
                      className="icon"
                      alt="Flexible hardware customization"
                    />
                    <p className="row-title">Flexible Hardware Customization</p>
                    <p className="row-text">
                      Designed with flexibility in mind, significantly reduce
                      costs and time burdens for your projects.
                    </p>
                  </div>
                  <div className="row-item">
                    <img
                      src="https://www.camthink.ai/resource/2025/06/Icon2.png"
                      className="icon"
                      alt="Comprehensive developer support"
                    />
                    <p className="row-title">Comprehensive Developer Support</p>
                    <p className="row-text">
                      Providing tailored support for developers to accelerate
                      project development by addressing coding and API
                      integration issues.
                    </p>
                  </div>
                  <div className="row-item">
                    <img
                      src="https://www.camthink.ai/resource/2025/06/Icon4.png"
                      className="icon"
                      alt="Edge Vision AI Efficiency"
                    />
                    <p className="row-title">Edge Vision AI Efficiency</p>
                    <p className="row-text">
                      Combining edge computing with IoT devices, Vision AI, and
                      5G edge connectivity empowers developers to develop
                      seamlessly.
                    </p>
                  </div>
                  <div className="row-item">
                    <img
                      src="https://www.camthink.ai/resource/2025/06/Icon3.png"
                      className="icon"
                      alt="Accelerated time-to-market"
                    />
                    <p className="row-title">Accelerated time-to-Market</p>
                    <p className="row-text">
                      Offering diverse support and flexible solutions to
                      streamline your project development process, thereby
                      achieving a faster time to market.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="s3-mobile">
            <div className="content">
              <h2 className="title">Sensing Innovation</h2>
              <p className="text">
                CamThink offers Sensing cameras and edge AI devices designed to
                help developers and engineers seamlessly transform their AI
                concepts into AI application scenarios. Empower your projects
                with easy integration and endless possibilities.
              </p>
              <div className="row">
                <div className="row-item">
                  <img
                    src="https://www.camthink.ai/resource/2025/06/camthink-vision-ai-icon1.png"
                    className="icon"
                    alt="Flexible hardware customization icon"
                  />
                  <p className="row-title">Flexible Hardware Customization</p>
                </div>
                <div className="row-item">
                  <img
                    src="https://www.camthink.ai/resource/2025/06/camthink-vision-ai-icon2.png"
                    className="icon"
                    alt="Comprehensive developer support icon"
                  />
                  <p className="row-title">Comprehensive Developer Support</p>
                </div>
                <div className="row-item">
                  <img
                    src="https://www.camthink.ai/resource/2025/06/camthink-vision-ai-icon3.png"
                    className="icon"
                    alt="Edge Vision AI efficiency icon"
                  />
                  <p className="row-title">Edge Vision AI Efficiency</p>
                </div>
                <div className="row-item">
                  <img
                    src="https://www.camthink.ai/resource/2025/06/camthink-vision-ai-icon4.png"
                    className="icon"
                    alt="Accelerated time-to-market icon"
                  />
                  <p className="row-title">Accelerated time-to-Market</p>
                </div>
              </div>
            </div>
          </div>

          <div className="s5" id="contact">
            <div className="content">
              <div className="left">
                <h2 className="title">
                  Get ready for the CamThink and drive innovation
                </h2>
                <p className="text1">
                  Join the first wave of innovators shaping the future of Vision
                  Al
                  <br />
                  with CamThink and unlock exclusive benefits
                </p>
                <ul style={{ listStylePosition: "inside", paddingLeft: "1rem" }}>
                  <li>
                    <strong style={{ color: "#ffffff" }}>
                      Showcase Your Innovation
                    </strong>{" "}
                    – Develop with CamThink for a chance to be featured in
                    official case studies, on the website, or social media.
                  </li>
                  <li>
                    <strong style={{ color: "#ffffff" }}>
                      Expert Consultation
                    </strong>{" "}
                    – Receive personalized guidance from CamThink specialists to
                    enhance your implementation.
                  </li>
                  <li>
                    <strong style={{ color: "#ffffff" }}>
                      Exclusive Merch Kit
                    </strong>{" "}
                    – Limited-edition CamThink merchandise for early supporters.
                  </li>
                </ul>
                <div className="hr" />
                <h3 className="sub-title">
                  Join our community on [Discord] to engage with us and fellow
                  early adopters!
                </h3>
                <div className="btn-wrap">
                  <a
                    href="https://discord.com/invite/6TZb2Y8WKx"
                    className="discord-btn"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="svg-wrap" />
                    <p>Join on Discord</p>
                  </a>
                </div>
              </div>
              <div className="right">
                <div
                  className="hs-form-frame"
                  data-region="na2"
                  data-form-id="168fbcf5-b79b-4a56-b8dc-a2681ead5a42"
                  data-portal-id="242960357"
                />
                <img
                  src="https://www.camthink.ai/resource/2025/06/Icon5.png"
                  className="form-bg"
                  alt="CamThink AI illustration"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
