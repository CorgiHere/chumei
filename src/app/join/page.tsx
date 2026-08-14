import type { Metadata } from "next";
import { JoinBand } from "@/components/JoinBand";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "加入竹梅｜清大交大籌備志工與贊助",
  description:
    "加入 2026 竹梅賽：清華大學、交通大學／陽明交通大學（清大／交大、NTHU／NYCU／NCTU）清交學生一起一本正經地胡鬧。竹梅籌備團隊、提案新活動、志工招募、週邊預購與贊助合作。",
  path: "/join",
});

export default function JoinPage() {
  return <JoinBand headingLevel="h1" />;
}
