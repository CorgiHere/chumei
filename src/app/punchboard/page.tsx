import type { Metadata } from "next";
import { Punchboard } from "@/components/Punchboard";
import { buildPageMetadata } from "@/lib/seo";
import { PUNCHBOARD_DEFAULT_NAME } from "@/lib/punchboard";

export const metadata: Metadata = buildPageMetadata({
  title: `${PUNCHBOARD_DEFAULT_NAME}即時排名｜11/17 清交拳擊機`,
  description:
    "2026 年 11 月 17 日竹梅賽拳擊機大賽即時排名。依男性／女性分榜，顯示姓名、分數、學校與系所，前三名特別標出。",
  path: "/punchboard",
});

export default function PunchboardPage() {
  return (
    <div className="bg-ink pb-8 text-chalk">
      <div className="section-space">
        <Punchboard headingLevel="h1" />
      </div>
    </div>
  );
}
