import type { Metadata } from "next";
import { SectionHeader } from "@/components/SectionHeader";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "聯絡我們",
  description: "竹梅籌備委員會聯絡方式與社群連結。",
};

export default function ContactPage() {
  return (
    <div className="grid-bg py-12">
      <div className="container-main max-w-xl">
        <SectionHeader title="聯絡我們" />

        <div className="card space-y-6 p-6">
          <div>
            <h2 className="font-black">竹梅籌備委員會</h2>
            <p className="mt-2 text-sm text-[var(--color-gray)]">
              清交學生自主籌辦的一系列好玩活動
            </p>
          </div>

          <dl className="space-y-4 text-sm">
            <div>
              <dt className="font-bold">Email</dt>
              <dd>
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="text-[var(--color-brand-blue)]"
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
                  className="text-[var(--color-brand-blue)]"
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
                  className="text-[var(--color-brand-blue)]"
                >
                  linktr.ee/chumei2026
                </a>
              </dd>
            </div>
          </dl>

          <p className="text-sm text-[var(--color-gray)]">
            🐼🦊 歡迎匿名提問，請至 Instagram 限時動態或 Linktree 表單。
          </p>
        </div>
      </div>
    </div>
  );
}
