import type { Metadata } from "next";
import { Punchboard } from "@/components/punchboard";
import { buildPageMetadata } from "@/lib/seo";
import { PUNCHBOARD_DEFAULT_NAME } from "@/lib/punchboard";

export const metadata: Metadata = buildPageMetadata({
  title: `${PUNCHBOARD_DEFAULT_NAME}即時排名｜11/17`,
  description:
    "2026 年 11 月 17 日竹梅賽「詐騙來電，Whoscall 開扁」即時排名。男生組／女生組分榜，顯示姓名、分數與學校。",
  path: "/punchboard",
});

export default function PunchboardPage() {
  return (
    <div className="bg-ink pb-10 text-white">
      <Punchboard headingLevel="h1" />
    </div>
  );
}
