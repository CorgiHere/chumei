import { siteConfig } from "@/data/site";

const roles = [
  {
    n: "01",
    title: "企劃",
    desc: "想出下一個沒有人要求的比賽項目，然後把它變成真的能玩的規則。",
  },
  {
    n: "02",
    title: "美術",
    desc: "主視覺、宣傳圖、周邊。畫得快比畫得好重要一點點。",
  },
  {
    n: "03",
    title: "程式",
    desc: "把企劃講的鬼東西做出來。網頁、報名系統、計分。",
  },
  {
    n: "04",
    title: "社群",
    desc: "在 Threads 上代表竹梅賽講話。留言區就是主戰場。",
  },
  {
    n: "05",
    title: "總務",
    desc: "借場地、保保險、扛獎品、對帳。整季能不能辦成靠這個。",
  },
];

type JoinBandProps = {
  headingLevel?: "h1" | "h2";
};

export function JoinBand({ headingLevel = "h2" }: JoinBandProps) {
  const Heading = headingLevel;
  const signup = siteConfig.linktreeUrl;

  return (
    <section className="section-space bg-brand-yellow text-ink" id="join">
      <div className="container-main">
        <p className="mb-2.5 font-mono-ui text-xs tracking-[0.2em] text-ink/55">
          招募
        </p>
        <Heading className="section-title mb-3 text-ink">
          加入<span className="bg-ink px-[0.08em] text-brand-yellow">我們</span>
        </Heading>
        <p className="mb-10 max-w-[44em] text-[15px] text-ink/70">
          下一季已經在想了，缺人。不用有經驗，但要有那種「這個想法很爛，做吧」的判斷力。
        </p>
        <div className="border-t-2 border-ink">
          {roles.map((role) => (
            <a
              key={role.n}
              href={signup}
              target="_blank"
              rel="noopener noreferrer"
              className="grid items-center gap-1.5 border-b-2 border-ink py-5 no-underline hover:bg-ink hover:text-brand-yellow md:grid-cols-[56px_1fr_2.1fr_auto] md:gap-5"
            >
              <span className="hidden font-mono-ui text-xs tracking-[0.12em] opacity-50 md:block">
                {role.n}
              </span>
              <span className="text-[26px] font-black">{role.title}</span>
              <span className="text-sm opacity-80">{role.desc}</span>
              <span className="font-mono-ui text-xs tracking-[0.12em] whitespace-nowrap">
                報名 →
              </span>
            </a>
          ))}
        </div>
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <a
            href={signup}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            填報名表
          </a>
          <a
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono-ui text-xs tracking-[0.08em] text-ink/70 no-underline hover:text-ink"
          >
            或私訊 @chumei2026
          </a>
        </div>
      </div>
    </section>
  );
}
