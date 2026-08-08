import type { Metadata } from "next";
import { SectionHeader } from "@/components/SectionHeader";
import { siteConfig } from "@/data/site";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "聯絡我們｜竹梅籌備委員會清交聯繫",
  description:
    "聯絡 2026 竹梅賽竹梅籌備委員會（清華大學／交通大學清交活動）：Email、Instagram @chumei2026、Facebook、Threads 與 Linktree。清大／交大（NTHU／NYCU／NCTU）相關洽詢歡迎來信。",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="grid-bg py-12">
      <div className="container-main max-w-xl">
        <SectionHeader title="聯絡我們" />

        <div className="card space-y-6 p-6">
          <div>
            <h2 className="font-black">竹梅籌備委員會</h2>
            <p className="mt-2 text-sm text-muted">
              清交學生自主籌辦的一系列好玩活動
            </p>
          </div>

          <dl className="space-y-4 text-sm">
            <div>
              <dt className="font-bold">Email</dt>
              <dd>
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="text-brand-blue"
                >
                  {siteConfig.contactEmail}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-bold">Instagram</dt>
              <dd>
                <a
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-blue"
                >
                  @chumei2026
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-bold">Facebook</dt>
              <dd>
                <a
                  href={siteConfig.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-blue"
                >
                  竹梅籌備委員會
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-bold">Threads</dt>
              <dd>
                <a
                  href={siteConfig.threadsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-blue"
                >
                  @chumei2026
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-bold">Linktree</dt>
              <dd>
                <a
                  href={siteConfig.linktreeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-blue"
                >
                  linktr.ee/chumei2026
                </a>
              </dd>
            </div>
          </dl>

          <p className="text-sm text-muted">
            🐼🦊 歡迎匿名提問，請至 Instagram 限時動態或 Linktree 表單。
          </p>
        </div>
      </div>
    </div>
  );
}
