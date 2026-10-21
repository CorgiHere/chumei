import base64
import json
import urllib.request
from pathlib import Path

# Prefer mid-video frame assembled from browser; fallback to IG video cover
parts_file = Path(r"c:\chumei\tmp-frame-parts.json")
out = Path(r"c:\chumei\public\images\activities\barcode-taiko.jpg")

ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

if parts_file.exists():
    data_url = parts_file.read_text(encoding="utf-8").strip()
    if data_url.startswith("data:image"):
        b64 = data_url.split(",", 1)[1]
        out.write_bytes(base64.b64decode(b64))
        print("wrote frame", out.stat().st_size)
    else:
        raise SystemExit("bad parts file")
else:
    raise SystemExit("no parts")
