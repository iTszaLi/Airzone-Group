"""Fetch the freely licensed Wikimedia Commons photographs used on the travel
and logistics pages and build responsive WebP variants (800/1400/1920 px).

Licences (CC0, public domain, CC BY, CC BY-SA) and authors are recorded in
artifacts/airzone-group/src/config/photography.ts and docs/photo-credits.md.
CC BY-SA images remain under that licence after resizing. These photographs
are illustrative: they do not depict Airzone vehicles, staff, customers,
trips or offices.

Usage (from the repository root):  python scripts/prepare-photos-commons.py [base ...]
Pass base names to fetch only those photographs.
Requires Pillow and network access to commons.wikimedia.org.
"""
import io
import json
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "artifacts/airzone-group/public/assets/photo"
UA = {"User-Agent": "AirzoneSiteBuild/1.0 (website build script)"}
WIDTHS = (800, 1400, 1920)

# base name -> Commons file title
PHOTOS = [
    ('maldives-atolls', 'File:Baa atoll islands.JPG'),
    ('maldives-island-villas', 'File:Malediven Atoll Luftbild (28800485916).jpg'),
    ('santorini-oia', 'File:Santorini, Oia 29.jpg'),
    ('dubai-skyline', 'File:Burj Khalifa Night View 01.jpg'),
    ('paris-seine', 'File:Eiffel Tower and Pont Alexandre III at night.jpg'),
    ('bali-terraces', 'File:Rice terraces, Bali.jpg'),
    ('tokyo-night', 'File:Tokyo Tower, Minato City.jpg'),
    ('cappadocia', 'File:Aerial view of Cappadocia from hot air balloon 64.jpg'),
    ('abu-dhabi-mosque', 'File:Sheikh Zayed Mosque Silhouette.jpg'),
    ('matterhorn', 'File:Matterhorn and Stellisee in Twilight.jpg'),
    ('positano', 'File:Positano (Italy) 03.jpg'),
    ('family-beach', 'File:USVI IMG 5166 - Tropical foliage frames a serene beach and turquoise water with palm trees swaying gently in the breeze.jpg'),
    ('luxury-pool', 'File:Negombo Beach resort pool (Unsplash).jpg'),
    ('sports-stadium', 'File:Mecz piłkarski Wisła Kraków - Zagłębie Sosnwoiec, 28 października 2022, Pożegnanie Stadionu Ludowego, KP.jpg'),
    ('medical-planning', 'File:Stethoscope and Laptop Computer - Nci-vol-9713-300.jpg'),
    ('adventure-ridge', 'File:Babia Góra po wschodzie słońca, 20210620 0451 7539.jpg'),
    ('airliner-wing', 'File:A wing tip of an airplane (40118125441).jpg'),
    ('airport-hall', 'File:Helsinki airport departure hall 2.jpg'),
    ('airport-terminal', 'File:Helsinki airport departure hall 1.jpg'),
    ('curtainside-trailer', 'File:W2425-Semi Tautliner 3750N8.jpg'),
    ('box-trailer-highway', 'File:Truck Florida.jpg'),
    ('panel-van', 'File:Ford Transit (2019) Rutesheimer Autoschau 2026 IMG 6783.jpg'),
    ('cargo-freighter', 'File:Nose cargo door of Boeing 747-8F.jpg'),
    ('container-yard', 'File:Zhangjiagang win hanverky container terminal port 2024-04.jpg'),
    ('reefer-trailer', 'File:Chereau-semiremorque-byRundvald.jpg'),
    ('lowbed-trailer', 'File:Flatbed low loader with tractor (Russia).jpg'),
    ('jeddah-port', 'File:Jeddah Islamic Port.jpg'),
    ('dammam-corniche', 'File:Dammam Almurjan 01 - panoramio.jpg'),
    ('jubail-corniche', 'File:Jubail 180349.jpg'),
    ('exhibition-stand', 'File:EBACE 2019, Le Grand-Saconnex (EB190646).jpg'),
    ('custom-exhibition-stand', 'File:Linstol, WTCE 2023, Hamburg (PEW37853).jpg'),
    ('product-demo-stand', 'File:Bosch eBike, IAA 2021, Munich (IAA10303).jpg'),
    ('led-wall-pixels', 'File:202506 LED電視牆的螢幕壞點 02.jpg'),
    ('mixing-console-case', 'File:DiGiCo S21 Mixing Console 2017.jpg'),
    ('moving-head-lights', 'File:Ravensburg Konzerthaus Scheinwerfer Moving head.jpg'),
    ('aluminium-truss-tower', 'File:Alu-Tower mit Wagen für eine Open-AIr-Veranstaltung.jpg'),
    ('interactive-display-wall', 'File:A user performing gesture interactions with a Powerwall display at the University of Leeds.jpg'),
    ('flight-cases-truck', 'File:Nuit Boréale 2013 011.jpg'),
    ('air-cargo-loader', 'File:Aircraft cargo (ULD) loader in operaton.jpg'),
]


def fetch(url: str) -> bytes:
    for attempt in range(4):
        try:
            return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=90).read()
        except Exception:
            time.sleep(3 + attempt * 4)
    raise RuntimeError(f"Could not download {url}")


def thumb_url(title: str) -> str:
    q = urllib.parse.urlencode({"action": "query", "format": "json", "titles": title, "prop": "imageinfo", "iiprop": "url", "iiurlwidth": 2400})
    pages = json.loads(fetch(f"https://commons.wikimedia.org/w/api.php?{q}"))["query"]["pages"]
    info = next(iter(pages.values()))["imageinfo"][0]
    return info.get("thumburl") or info["url"]


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    only = set(sys.argv[1:])
    for base, title in PHOTOS:
        if only and base not in only:
            continue
        im = Image.open(io.BytesIO(fetch(thumb_url(title)))).convert("RGB")
        for w in WIDTHS:
            h = round(im.height * w / im.width)
            im.resize((w, h), Image.LANCZOS).save(OUT / f"{base}-{w}.webp", "WEBP", quality=74, method=6)
        print(f"{base}: 1920 x {round(im.height * 1920 / im.width)}")
        time.sleep(1)


if __name__ == "__main__":
    main()
