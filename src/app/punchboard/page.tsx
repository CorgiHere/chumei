import type { Metadata } from "next";
import { Punchboard } from "@/components/punchboard/Punchboard";
import { JsonLd } from "@/components/JsonLd";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  eventJsonLd,
} from "@/lib/seo";
import { PUNCHBOARD_DEFAULT_NAME } from "@/lib/punchboard";

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
      <Punchboard />
    </div>
  );
}
