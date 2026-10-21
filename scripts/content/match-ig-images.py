import json
import re
from pathlib import Path

p = Path(
    r"C:\Users\柯基\.cursor\browser-logs\cdp-response-Runtime.evaluate-2026-08-06T07-17-53-862Z.json"
)
raw = json.loads(p.read_text(encoding="utf-8"))
val = raw
# Unwrap common CDP shapes
for _ in range(5):
    if isinstance(val, dict) and "result" in val and "value" not in val:
        val = val["result"]
    elif isinstance(val, dict) and "result" in val and isinstance(val["result"], dict) and "value" in val["result"]:
        val = val["result"]["value"]
    elif isinstance(val, dict) and "value" in val and "posts" not in val:
        val = val["value"]
    else:
        break

posts = val["posts"]
out = Path(r"c:\chumei\tmp-ig-media.json")
out.write_text(json.dumps(posts, ensure_ascii=False, indent=2), encoding="utf-8")

keywords = {
    "kong-vs-godzilla": ["金剛", "哥吉拉", "前哨"],
    "dinosaur-race": ["恐龍賽跑", "恐龍騎", "毛毛蟲"],
    "alcohol-calculus": ["酒精微積分"],
    "office-chair-racing": ["辦公椅"],
    "japanese-mahjong": ["日本麻將"],
    "taiwan-mahjong": ["臺灣麻將", "台灣麻將", "四人臺灣", "交清麻將"],
    "barcode-racing": ["刷條碼競速", "條碼競速"],
    "two-school-rps": ["兩校憑拳", "憑拳", "猜拳"],
    "galaga-president": ["旮拉給木", "嘎拉給木", "galaga", "校長"],
    "barcode-taiko": ["條碼達人", "刷條碼太鼓"],
    "lawn-scream": ["大尖叫", "大草坪大尖叫"],
}

# Prefer result/promo posts with real photos: prefer posts that aren't just text announcements when possible
matches = {k: [] for k in keywords}
for post in posts:
    cap = post.get("caption") or ""
    for slug, kws in keywords.items():
        if any(k in cap for k in kws):
            matches[slug].append(
                {
                    "shortcode": post["shortcode"],
                    "caption": cap[:120].replace("\n", " "),
                    "image": post.get("image"),
                    "carousel": post.get("carousel") or [],
                    "carouselCount": post.get("carouselCount", 0),
                }
            )

summary = []
for slug, items in matches.items():
    summary.append(f"## {slug} ({len(items)})")
    for it in items:
        summary.append(f"- {it['shortcode']} car={it['carouselCount']} | {it['caption']}")

Path(r"c:\chumei\tmp-ig-match.txt").write_text("\n".join(summary), encoding="utf-8")
print("posts", len(posts))
print("written match file")
for slug, items in matches.items():
    print(slug, len(items))
