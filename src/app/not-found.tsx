import Link from "next/link";
import { appPath } from "@/lib/utils";

export default function NotFound() {
  return (
    <section className="section-space bg-ink text-chalk">
      <div className="container-main max-w-xl">
        <p className="eyebrow">404</p>
        <h1 className="display-title text-h1">
          這頁<span className="mark">不存在</span>
        </h1>
        <p className="mt-4 text-[15px] text-muted">
          網址可能打錯，或這場荒謬已經換地方了。
        </p>
        <Link href={appPath("/")} className="btn-primary mt-8 inline-flex">
          回首頁
        </Link>
      </div>
    </section>
  );
}
