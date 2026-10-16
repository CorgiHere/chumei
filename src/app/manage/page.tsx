import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { SiteFlagsAdmin } from "@/components/SiteFlagsAdmin";

export const metadata: Metadata = {
  title: "網站管理",
  robots: { index: false, follow: false, nocache: true },
};

export default function ManagePage() {
  return (
    <div className="bg-ink section-space text-chalk">
      <div className="container-main">
        <PageIntro
          eyebrow="籌委會"
          title="網站管理"
          subtitle="分開控制封鎖條、按鈕旋轉、右下角按鈕、頁尾與關於頁加入入口。請用拳擊機後台同一組密碼。"
        />
        <SiteFlagsAdmin />
      </div>
    </div>
  );
}
