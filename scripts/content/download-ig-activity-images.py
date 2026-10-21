import json
import re
import urllib.request
from pathlib import Path

src = Path(
    r"C:\Users\柯基\.cursor\browser-logs\cdp-response-Runtime.evaluate-2026-08-06T07-19-19-356Z.json"
)
raw = json.loads(src.read_text(encoding="utf-8"))
val = raw
for _ in range(6):
    if isinstance(val, dict) and "posts" in val:
        break
    if isinstance(val, dict) and "result" in val:
        val = val["result"]
        continue
    if isinstance(val, dict) and "value" in val:
        val = val["value"]
        continue
    break

posts = [p for p in val["posts"] if not p.get("error") and p.get("image")]
Path(r"c:\chumei\tmp-ig-media.json").write_text(
    json.dumps(posts, ensure_ascii=False, indent=2), encoding="utf-8"
)

# Prefer photo-heavy result / review posts; pick a non-first carousel slide when available
picks = {
    "kong-vs-godzilla": ("DWOJcC1EtO5", 1),  # activity review photos
    "dinosaur-race": ("DWggtf6kmv8", 1),
    "alcohol-calculus": ("DW0vItSjneJ", 1),
    "office-chair-racing": ("DW8_NGEkqP1", 0),  # champion riding chair
    "japanese-mahjong": ("DWVO9kcEjhl", 0),
    "taiwan-mahjong": ("DWVv1V7Dv6v", 0),
    "barcode-racing": ("DXOlu9akqto", 1),
    "two-school-rps": ("DXRiFuoErbl", 1),
    "lawn-scream": ("DY6p2fskiQ6", 0),
    # championship poster as fallback brand visual for galaga if needed later
    "championship": ("DXbxyXpEvby", 0),
}

by_code = {p["shortcode"]: p for p in posts}

# Find galaga / barcode-taiko by caption
for p in posts:
    cap = p.get("caption") or ""
    if any(k in cap for k in ["旮拉給木", "嘎拉給木", "galaga", "Galaga", "校長旮"]):
        print("GALAGA", p["shortcode"], cap[:80].replace("\n", " "))
    if any(k in cap for k in ["條碼達人", "太鼓", "刷條碼太鼓"]):
        print("TAIKO", p["shortcode"], cap[:80].replace("\n", " "))

out_dir = Path(r"c:\chumei\public\images\activities")
out_dir.mkdir(parents=True, exist_ok=True)

ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"


def pick_url(post, idx):
    car = post.get("carousel") or []
    if car:
        idx = min(idx, len(car) - 1)
        return car[idx].get("url") or post.get("image")
    return post.get("image")


def download(url, dest: Path):
    req = urllib.request.Request(url, headers={"User-Agent": ua, "Referer": "https://www.instagram.com/"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = resp.read()
    dest.write_bytes(data)
    return len(data)


manifest = {}
for slug, (code, idx) in picks.items():
    post = by_code.get(code)
    if not post:
        print("MISSING", slug, code)
        continue
    url = pick_url(post, idx)
    if not url:
        print("NO URL", slug)
        continue
    ext = ".jpg"
    dest = out_dir / f"{slug}{ext}"
    try:
        n = download(url, dest)
        manifest[slug] = {"file": dest.name, "shortcode": code, "slide": idx, "bytes": n}
        print("OK", slug, n)
    except Exception as e:
        print("FAIL", slug, e)

# Also download office chair result as alternate if needed
Path(r"c:\chumei\tmp-ig-download-manifest.json").write_text(
    json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8"
)
print("done", len(manifest))
