import type { Metadata } from "next";
import Link from "next/link";
import { Punchboard } from "@/components/punchboard/Punchboard";
import { JsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/data/site";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  eventJsonLd,
} from "@/lib/seo";
import { PUNCHBOARD_DEFAULT_NAME } from "@/lib/punchboard";
import { appPath } from "@/lib/utils";

const description =
  "2026 竹梅賽「詐騙來電，Whoscall 開扁」即時排名。11 月 17 日清大、交大現場拳擊機，男生組／女生組分榜。先填報名表領 ID，不是梅竹賽。";

export const metadata: Metadata = buildPageMetadata({
  title: `${PUNCHBOARD_DEFAULT_NAME}即時排名｜11/17`,
  description,
  path: "/punchboard",
  image: "/images/punchboard/event-title.png",
});

export default function PunchboardPage() {
  return (
    <div className="bg-ink pb-10 text-white">
      <JsonLd
        data={[
          eventJsonLd({
            name: PUNCHBOARD_DEFAULT_NAME,
            description,
            startDate: "2026-11-17T00:00:00+08:00",
            endDate: "2026-11-17T23:59:00+08:00",
            path: "/punchboard",
            image: "/images/punchboard/event-title.png",
            locationName: "新竹：國立清華大學、國立陽明交通大學",
            status: "registration_open",
          }),
          breadcrumbJsonLd([
            { name: "首頁", path: "/" },
            { name: PUNCHBOARD_DEFAULT_NAME, path: "/punchboard" },
          ]),
        ]}
      />
      <div className="container-main py-5 text-[14px] leading-relaxed text-white/80">
        <h1 className="text-xl font-black text-white md:text-2xl">
          {PUNCHBOARD_DEFAULT_NAME}即時排名
        </h1>
        <p className="mt-2 max-w-[46em]">
          2026 年 11 月 17 日竹梅賽與 Whoscall 合作的現場拳擊機活動。須先填報名表領
          ID，成績即時出現在本頁，分男生組與女生組。
        </p>
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
          <a
            href={siteConfig.punchFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#ffd54a] underline underline-offset-4"
          >
            立即報名
          </a>
          <Link
            href={appPath("/activities/punchboard")}
            className="text-[#15DCE8] underline underline-offset-4"
          >
            活動說明
          </Link>
        </p>
      </div>
      <Punchboard headingLevel="h2" />
    </div>
  );
}
