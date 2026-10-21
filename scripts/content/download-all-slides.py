import json
import urllib.request
from pathlib import Path

posts = json.loads(Path(r"c:\chumei\tmp-ig-media.json").read_text(encoding="utf-8"))
by = {p["shortcode"]: p for p in posts}
out = Path(r"c:\chumei\tmp-ig-slides")
out.mkdir(exist_ok=True)

codes = [
    "DWOJcC1EtO5",  # kong review
    "DWJL0sEkunZ",  # kong promo
    "DWggtf6kmv8",  # dino result
    "DWTntdcj-Ik",  # dino extra
    "DV8czajj72g",  # dino reg
    "DW0vItSjneJ",  # alcohol
    "DWZGf3okqPk",  # alcohol promo
    "DW-lvPikgxN",  # chair result
    "DW8_NGEkqP1",  # chair ride
    "DWVO9kcEjhl",  # jp mahjong
    "DWVv1V7Dv6v",  # tw mahjong
    "DXOlu9akqto",  # barcode
    "DXRiFuoErbl",  # rps
    "DW_bad_ErlN",  # rps promo
    "DY6p2fskiQ6",  # scream
    "DXbxyXpEvby",  # championship
    "DWq3cKMEnyh",  # barcode reg
]

ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"


def download(url, dest):
    req = urllib.request.Request(
        url, headers={"User-Agent": ua, "Referer": "https://www.instagram.com/"}
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        dest.write_bytes(resp.read())


index_lines = []
for code in codes:
    p = by.get(code)
    if not p:
        index_lines.append(f"{code}: MISSING")
        continue
    cap = (p.get("caption") or "")[:80].replace("\n", " ")
    cars = p.get("carousel") or []
    if not cars and p.get("image"):
        cars = [{"i": 0, "url": p["image"]}]
    for c in cars:
        i = c["i"]
        url = c.get("url")
        if not url:
            continue
        dest = out / f"{code}_{i}.jpg"
        try:
            download(url, dest)
            index_lines.append(f"{code}_{i}.jpg | {cap}")
            print("ok", dest.name, dest.stat().st_size)
        except Exception as e:
            print("fail", code, i, e)

# caption search
for p in posts:
    cap = p.get("caption") or ""
    hits = []
    for k in ["旮拉", "給木", "達人", "太鼓", "校長", "galaga", "Galaga", "街機"]:
        if k.lower() in cap.lower() or k in cap:
            hits.append(k)
    if hits:
        index_lines.append(f"HIT {p['shortcode']} {hits} | {cap[:100].replace(chr(10),' ')}")

Path(r"c:\chumei\tmp-ig-slides\INDEX.txt").write_text(
    "\n".join(index_lines), encoding="utf-8"
)
print("slides", len(list(out.glob('*.jpg'))))
