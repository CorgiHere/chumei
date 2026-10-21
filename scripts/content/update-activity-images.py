import re
from pathlib import Path

p = Path(r"c:\chumei\src\data\activities.ts")
t = p.read_text(encoding="utf-8")
mapping = [
    ("kong-vs-godzilla", "kong-vs-godzilla"),
    ("dinosaur-race", "dinosaur-race"),
    ("alcohol-calculus", "alcohol-calculus"),
    ("office-chair-racing", "office-chair"),
    ("japanese-mahjong", "japanese-mahjong"),
    ("taiwan-mahjong", "taiwan-mahjong"),
    ("barcode-racing", "barcode"),
    ("two-school-rps", "rps"),
    ("galaga-president", "galaga"),
    ("barcode-taiko", "barcode-taiko"),
    ("lawn-scream", "lawn-scream"),
]

for slug, img in mapping:
    pat = (
        rf'(slug: "{slug}",[\s\S]*?heroImage: ")[^"]+'
        rf'(",[\s\S]*?cardImage: ")[^"]+(")'
    )
    t2, n = re.subn(
        pat,
        rf"\1/images/activities/{img}.svg\2/images/activities/{img}.svg\3",
        t,
        count=1,
    )
    print(slug, n)
    t = t2

p.write_text(t, encoding="utf-8")
