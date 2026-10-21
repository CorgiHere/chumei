from pathlib import Path

out = Path(r"c:\chumei\public\images\activities")
out.mkdir(parents=True, exist_ok=True)
hero = Path(r"c:\chumei\public\images\gallery")
hero.mkdir(parents=True, exist_ok=True)

items = [
    ("kong-vs-godzilla", "金剛大戰哥吉拉", "#12A9E8", "#FFBF00", "01"),
    ("dinosaur-race", "恐龍賽跑", "#FFBF00", "#1E9E58", "02"),
    ("alcohol-calculus", "酒精微積分", "#7A1F40", "#FFBF00", "03"),
    ("office-chair", "辦公椅錦標賽", "#1E4E8C", "#D8F238", "04"),
    ("japanese-mahjong", "日本麻將推廣賽", "#D8F238", "#0A0A0A", "05"),
    ("taiwan-mahjong", "四人臺灣麻將", "#FFBF00", "#7A1F40", "06"),
    ("barcode", "刷條碼競速賽", "#0A0A0A", "#FFBF00", "07"),
    ("rps", "兩校憑拳", "#12A9E8", "#FFFFFF", "08"),
    ("galaga", "攻略校長旮拉給木", "#181818", "#12A9E8", "09"),
    ("barcode-taiko", "條碼達人", "#1E4E8C", "#FFBF00", "10"),
    ("lawn-scream", "大草坪大尖叫", "#D92D20", "#FFBF00", "11"),
]

for slug, title, bg, accent, mark in items:
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img" aria-label="{title}">
  <rect width="800" height="600" fill="{bg}"/>
  <rect x="40" y="40" width="720" height="520" fill="none" stroke="{accent}" stroke-width="12"/>
  <circle cx="140" cy="140" r="54" fill="{accent}"/>
  <text x="140" y="155" text-anchor="middle" font-size="28" font-weight="900" fill="{bg}" font-family="Noto Sans TC, sans-serif">{mark}</text>
  <text x="400" y="320" text-anchor="middle" font-size="40" font-weight="900" fill="{accent}" font-family="Noto Sans TC, sans-serif">{title}</text>
  <rect x="200" y="380" width="400" height="16" fill="{accent}"/>
</svg>
"""
    (out / f"{slug}.svg").write_text(svg, encoding="utf-8")
    print("wrote", slug)

poster = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" role="img" aria-label="2026 竹梅賽主視覺">
  <rect width="800" height="1000" fill="#0A0A0A"/>
  <rect x="48" y="48" width="704" height="904" fill="none" stroke="#FFBF00" stroke-width="16"/>
  <rect x="120" y="180" width="240" height="240" fill="#12A9E8"/>
  <rect x="400" y="280" width="280" height="180" fill="#FFBF00"/>
  <rect x="160" y="520" width="480" height="24" fill="#D8F238"/>
  <text x="400" y="700" text-anchor="middle" font-size="72" font-weight="900" fill="#FFFFFF" font-family="Noto Sans TC, sans-serif">竹梅賽</text>
  <text x="400" y="780" text-anchor="middle" font-size="36" font-weight="900" fill="#FFBF00" font-family="Noto Sans TC, sans-serif">2026 強勢回歸</text>
</svg>
"""
(hero / "hero-poster.svg").write_text(poster, encoding="utf-8")
print("wrote hero-poster")
