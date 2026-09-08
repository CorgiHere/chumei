import type { Metadata } from "next";
import { PathVote } from "@/components/PathVote";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "清交小徑 v.s. 交清小徑｜命名投票",
  description:
    "到底叫清交小徑還是交清小徑？同一條路，兩種叫法。這次讓清交人自己決定。",
  path: "/path-vote",
});

export default function PathVotePage() {
  return (
    <div className="bg-ink pb-8 text-chalk">
      <div className="section-space">
        <PathVote headingLevel="h1" />
      </div>
    </div>
  );
}
