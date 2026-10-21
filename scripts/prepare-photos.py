"""Fetch the licensed editorial photographs used on the site and build
responsive WebP variants (800/1400/1920 px wide).

All images are illustrative third-party photography (Unsplash License: free
commercial use, modification allowed). They do not depict Airzone vehicles,
facilities, staff or customers. Credits: docs/photo-credits.md and
artifacts/airzone-group/src/config/photography.ts.

Usage (from the repository root):  python scripts/prepare-photos.py
Requires Pillow (pip install pillow) and network access to images.unsplash.com.
"""
import io
import urllib.request
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "artifacts/airzone-group/public/assets/photo"

# base name -> Unsplash image path (photo id slug on images.unsplash.com)
PHOTOS = {
    "truck-desert-highway": "photo-1592838064575-70ed626d3a0e",
    "semi-truck-open-road": "photo-1720811559337-c59b75acc4de",
    "multi-axle-flatbed-trailer": "photo-1756888218644-aeb9c044e1df",
    "oversize-load-transport": "photo-1783428673297-17e7fc9f85fb",
    "warehouse-racking-aisle": "photo-1644079446600-219068676743",
    "warehouse-operations": "photo-1684695749267-233af13276d0",
    "box-van-local-delivery": "photo-1614976523626-d598aafd4fda",
    "box-truck-loading": "photo-1601467995997-ac1ae9a8fff4",
}
WIDTHS = (800, 1400, 1920)
# Busy, high-detail scenes compress poorly; a lower quality keeps them light.
QUALITY = {"box-van-local-delivery": 62, "warehouse-operations": 62}


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for base, path in PHOTOS.items():
        url = f"https://images.unsplash.com/{path}?w=2400&q=85&fm=jpg&fit=max"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (AirzoneSiteBuild)"})
        im = Image.open(io.BytesIO(urllib.request.urlopen(req, timeout=60).read())).convert("RGB")
        for w in WIDTHS:
            h = round(im.height * w / im.width)
            im.resize((w, h), Image.LANCZOS).save(OUT / f"{base}-{w}.webp", "WEBP", quality=QUALITY.get(base, 74), method=6)
        print(f"{base}: source {im.size}, 1920 variant height {round(im.height * 1920 / im.width)}")


if __name__ == "__main__":
    main()
