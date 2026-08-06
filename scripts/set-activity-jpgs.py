import re
from pathlib import Path

p = Path(r"c:\chumei\src\data\activities.ts")
t = p.read_text(encoding="utf-8")

# Map slug -> jpg filename (without path)
mapping = {
    "kong-vs-godzilla": "kong-vs-godzilla.jpg",
    "dinosaur-race": "dinosaur-race.jpg",
    "alcohol-calculus": "alcohol-calculus.jpg",
    "office-chair-racing": "office-chair.jpg",
    "japanese-mahjong": "japanese-mahjong.jpg",
    "taiwan-mahjong": "taiwan-mahjong.jpg",
    "barcode-racing": "barcode.jpg",
    "two-school-rps": "rps.jpg",
    "galaga-president": "galaga.jpg",
    "barcode-taiko": "barcode-taiko.jpg",
    "lawn-scream": "lawn-scream.jpg",
}

for slug, img in mapping.items():
    pat = (
        rf'(slug: "{slug}",[\s\S]*?heroImage: ")[^"]+'
        rf'(",[\s\S]*?cardImage: ")[^"]+(")'
    )
    t2, n = re.subn(
        pat,
        rf"\1/images/activities/{img}\2/images/activities/{img}\3",
        t,
        count=1,
    )
    print(slug, n)
    t = t2

p.write_text(t, encoding="utf-8")
