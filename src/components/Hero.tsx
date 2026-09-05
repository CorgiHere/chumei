"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/data/site";
import { withBasePath, appPath } from "@/lib/utils";
import { galleryItems } from "@/data/history";
import { HazardBar } from "./HazardBar";

const slides = galleryItems.slice(0, 5).map((item) => ({
  src: item.imageUrl,
  title: item.title,
  alt: item.alt,
}));

export function Hero() {
  const [index, setIndex] = useState(0);
  const total = slides.length || 1;

  useEffect(() => {
    if (slides.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, []);

  const current = slides[index] ?? slides[0];

  return (
    <section className="relative bg-ink text-chalk">
      <HazardBar />
      <div className="container-main grid items-center gap-8 py-12 lg:grid-cols-2 lg:items-stretch lg:gap-12 lg:py-14">
        <div className="flex flex-col justify-center">
          <p className="eyebrow">
            國立清華大學 × 國立交通大學　／　{siteConfig.yearName}
          </p>
          <h1 className="display-title mb-5 text-[clamp(30px,4.5vw,66px)]">
            只要是清交人
            <br />
            就絕對不能
            <br />
            錯過的<span className="mark">竹梅</span>
          </h1>
          <p className="mb-8 max-w-[32em] text-[15px] text-muted">
            竹梅賽致力於在清交大搞一些蝦趴事，為無聊的新竹帶來最好玩的活動，籌備恐龍賽跑開始、大草坪大尖叫、酒精微積分、辦公椅競速、刷條碼競速到猜拳送機票等。
          </p>
          <div className="mb-8 flex flex-wrap gap-3">
            <Link href={appPath("/scoreboard")} className="btn-primary">
              查看完整賽果
            </Link>
            <Link href={appPath("/activities")} className="btn-dark-outline">
              瀏覽全部活動
            </Link>
          </div>
          <div className="flex flex-wrap border-t border-white/15">
            <div className="mr-6 border-r border-white/15 pr-6 pt-3.5">
              <b className="font-num block text-[26px] leading-none font-bold">07</b>
              <span className="font-mono-ui text-[11px] tracking-[0.12em] text-muted">
                計分對抗
              </span>
            </div>
            <div className="mr-6 border-r border-white/15 pr-6 pt-3.5">
              <b className="font-num block text-[26px] leading-none font-bold">
                {siteConfig.nthuScore}：{siteConfig.nycuScore}
              </b>
              <span className="font-mono-ui text-[11px] tracking-[0.12em] text-muted">
                清大／交大
              </span>
            </div>
            <div className="pt-3.5">
              <b className="font-num block text-[26px] leading-none font-bold">
                學生自辦
              </b>
              <span className="font-mono-ui text-[11px] tracking-[0.12em] text-muted">
                非學校組織
              </span>
            </div>
          </div>
        </div>

        <div className="relative aspect-4/3 overflow-hidden bg-ink lg:aspect-auto lg:min-h-0">
          {slides.map((slide, i) => (
            <div
              key={slide.src}
              className={`absolute inset-0 bg-[#F2F0EA] p-2 shadow-[0_14px_34px_-18px_rgba(0,0,0,.9)] transition-opacity duration-700 ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="relative h-full w-full">
                <img
                  src={withBasePath(slide.src)}
                  alt={slide.alt}
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
              </div>
            </div>
          ))}
          {current && (
            <div className="absolute bottom-4 left-4 z-10 flex max-w-[calc(100%-60px)] flex-wrap items-baseline gap-3 lg:bottom-5 lg:left-5">
              <span className="text-[19px] font-black leading-tight">{current.title}</span>
            </div>
          )}
          {slides.length > 1 && (
            <>
              <div className="absolute right-4 top-4 z-10 hidden gap-0.5 sm:flex lg:right-5 lg:top-5">
                <button
                  type="button"
                  className="h-9.5 w-9.5 border-2 border-brand-yellow bg-black/55 font-mono-ui text-[15px] text-brand-yellow hover:bg-brand-yellow hover:text-ink"
                  onClick={() => setIndex((i) => (i - 1 + total) % total)}
                  aria-label="上一張"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="h-9.5 w-9.5 border-2 border-brand-yellow bg-black/55 font-mono-ui text-[15px] text-brand-yellow hover:bg-brand-yellow hover:text-ink"
                  onClick={() => setIndex((i) => (i + 1) % total)}
                  aria-label="下一張"
                >
                  ›
                </button>
              </div>
              <div className="absolute right-4 bottom-4 z-10 flex gap-1.5 lg:right-5 lg:bottom-5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`第 ${i + 1} 張`}
                    aria-selected={i === index}
                    className={`h-1 w-7.5 border-0 p-0 ${
                      i === index ? "bg-brand-yellow" : "bg-chalk/40"
                    }`}
                    onClick={() => setIndex(i)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
