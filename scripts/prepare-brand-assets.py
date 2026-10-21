"""Regenerate Airzone logo and browser-icon assets from the supplied originals.

Deterministic processing only: trimming of empty white margins, proportional
resizing and format conversion. No tracing, retyping, recolouring or redrawing.
The original files in attached_assets/ are never modified.

Usage (from the repository root):  python scripts/prepare-brand-assets.py
Requires Pillow (pip install pillow).
"""
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "attached_assets"
OUT = ROOT / "artifacts/airzone-group/public/assets/brand"
PUBLIC = ROOT / "artifacts/airzone-group/public"

GROUP_SRC = SRC / "airzone_group_logo_1791705665605.png"  # "airzone group logo.png" (1738x905)
LOGISTICS_SRC = SRC / "airzone_logo_1791705278769.png"  # "airzone logo.png" letterhead (2170x725)
TRAVEL_SRC = SRC / "Airzone_travel_Logo_1791705915645.jpg"  # (997x1024)

# Bump when favicon artwork changes so browsers do not keep a cached icon.
ICON_VERSION = "v2"


def trim_white(im: Image.Image, fuzz: int = 14) -> Image.Image:
    rgb = im.convert("RGB")
    diff = ImageChops.difference(rgb, Image.new("RGB", rgb.size, (255, 255, 255)))
    mask = diff.convert("L").point(lambda p: 255 if p > fuzz else 0)
    return im.crop(mask.getbbox())


def pad(im: Image.Image, ratio: float) -> Image.Image:
    """Add even white margin (ratio of the larger side) around artwork."""
    m = round(max(im.size) * ratio)
    canvas = Image.new("RGB", (im.width + 2 * m, im.height + 2 * m), "white")
    canvas.paste(im.convert("RGB"), (m, m))
    return canvas


def save_widths(im: Image.Image, name: str, widths: list[int]) -> None:
    for w in widths:
        h = round(im.height * w / im.width)
        r = im.resize((w, h), Image.LANCZOS)
        r.save(OUT / f"{name}-{w}.webp", "WEBP", quality=92, method=6)
        r.save(OUT / f"{name}-{w}.png", "PNG", optimize=True)
        print(f"  {name}-{w} ({w}x{h})")


def white_to_alpha(im: Image.Image) -> Image.Image:
    """Exact 'unmultiply white': alpha = distance from white, colour restored.

    Compositing the result on white reproduces the original pixels, so the
    artwork is unchanged; only the white canvas becomes transparent.
    """
    rgb = im.convert("RGB")
    px = rgb.load()
    out = Image.new("RGBA", rgb.size)
    op = out.load()
    for y in range(rgb.height):
        for x in range(rgb.width):
            r, g, b = px[x, y]
            a = 255 - min(r, g, b)
            if a <= 3:
                op[x, y] = (255, 255, 255, 0)
                continue
            k = 255 / a
            op[x, y] = (
                min(255, round(255 - (255 - r) * k)),
                min(255, round(255 - (255 - g) * k)),
                min(255, round(255 - (255 - b) * k)),
                a,
            )
    return out


def disc_icon(logo: Image.Image, size: int, sharpen: bool) -> Image.Image:
    """Whole logo centred in a white disc, transparent outside the circle.

    The logo is scaled as large as possible while essentially none of its
    ink falls outside the circle, so nothing is cropped or distorted.
    """
    work = 1024
    ink = ImageChops.difference(logo.convert("RGB"), Image.new("RGB", logo.size, "white")).convert("L").point(lambda p: 255 if p > 40 else 0)
    circle = Image.new("L", (work, work), 0)
    ImageDraw.Draw(circle).ellipse((0, 0, work - 1, work - 1), fill=255)
    inset = round(work * 0.06)  # breathing room inside the disc edge
    inner = Image.new("L", (work, work), 0)
    ImageDraw.Draw(inner).ellipse((inset, inset, work - 1 - inset, work - 1 - inset), fill=255)

    lo, hi = 0.5, 1.2
    for _ in range(18):
        s = (lo + hi) / 2
        w = round(work * s)
        h = round(logo.height * w / logo.width)
        m = Image.new("L", (work, work), 0)
        m.paste(ink.resize((w, h)), ((work - w) // 2, (work - h) // 2))
        outside = ImageChops.subtract(m, inner)
        total = sum(m.histogram()[1:]) or 1
        (lo, hi) = (s, hi) if sum(outside.histogram()[1:]) / total < 0.0005 else (lo, s)
    w = round(work * lo)
    h = round(logo.height * w / logo.width)
    canvas = Image.new("RGBA", (work, work), (255, 255, 255, 255))
    canvas.paste(logo.convert("RGB").resize((w, h), Image.LANCZOS), ((work - w) // 2, (work - h) // 2))
    canvas.putalpha(circle.resize((work, work)))
    # Supersampled anti-aliased edge.
    big = Image.new("L", (work * 4, work * 4), 0)
    ImageDraw.Draw(big).ellipse((0, 0, work * 4 - 1, work * 4 - 1), fill=255)
    canvas.putalpha(big.resize((work, work), Image.LANCZOS))
    icon = canvas.resize((size, size), Image.LANCZOS)
    if sharpen:
        rgb = icon.convert("RGB").filter(ImageFilter.UnsharpMask(radius=0.6, percent=70, threshold=1))
        rgb.putalpha(icon.getchannel("A"))
        icon = rgb
    return icon


def square_icon(logo: Image.Image, size: int, fill_ratio: float) -> Image.Image:
    """Opaque white square (Apple touch / PWA icons); platforms apply masks."""
    canvas = Image.new("RGB", (size, size), "white")
    w = round(size * fill_ratio)
    h = round(logo.height * w / logo.width)
    canvas.paste(logo.convert("RGB").resize((w, h), Image.LANCZOS), ((size - w) // 2, (size - h) // 2))
    return canvas


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    group = trim_white(Image.open(GROUP_SRC))
    print(f"Group logo trimmed to {group.size}")
    save_widths(pad(group, 0.02), "airzone-group-logo", [240, 480, 960])
    group_alpha = white_to_alpha(pad(group, 0.02))
    for w in (240, 480):
        h = round(group_alpha.height * w / group_alpha.width)
        group_alpha.resize((w, h), Image.LANCZOS).save(OUT / f"airzone-group-logo-transparent-{w}.png", optimize=True)
    # Organization schema logo (≥112px, crawlable, stable URL).
    pad(group, 0.04).resize((1200, round(pad(group, 0.04).height * 1200 / pad(group, 0.04).width)), Image.LANCZOS).save(OUT / "airzone-group-logo-1200.png", optimize=True)

    # Logistics: English name + globe only, exactly as previously approved.
    # The Arabic registration panel and full-width rule are excluded.
    letterhead = Image.open(LOGISTICS_SRC)
    logistics = trim_white(letterhead.crop((20, 150, 1330, 465)))
    print(f"Logistics crop {logistics.size}")
    save_widths(pad(logistics, 0.02), "airzone-logistics-logo", [320, 640, 1280])

    travel = trim_white(Image.open(TRAVEL_SRC))
    print(f"Travel logo trimmed to {travel.size}")
    save_widths(pad(travel, 0.03), "airzone-travel-logo", [160, 320, 640])

    # Browser icons: circular, transparent corners, tuned per size.
    icons = {s: disc_icon(group, s, sharpen=s <= 48) for s in (16, 32, 48, 96, 192)}
    for s, im in icons.items():
        im.save(OUT / f"favicon-{ICON_VERSION}-{s}.png", optimize=True)
    icons[48].save(
        OUT / f"favicon-{ICON_VERSION}.ico", format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)], append_images=[icons[16], icons[32]],
    )
    # Conventional root icon for crawlers and clients that request /favicon.ico.
    icons[48].save(PUBLIC / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)], append_images=[icons[16], icons[32]])
    square_icon(group, 180, 0.86).save(OUT / f"apple-touch-icon-{ICON_VERSION}.png", optimize=True)
    square_icon(group, 192, 0.86).save(OUT / f"icon-{ICON_VERSION}-192.png", optimize=True)
    square_icon(group, 512, 0.86).save(OUT / f"icon-{ICON_VERSION}-512.png", optimize=True)
    square_icon(group, 512, 0.72).save(OUT / f"icon-{ICON_VERSION}-maskable-512.png", optimize=True)

    # Social sharing card (1200x630): official logo on white, brand rule below.
    card = Image.new("RGB", (1200, 630), "white")
    lw = 720
    lh = round(group.height * lw / group.width)
    card.paste(group.convert("RGB").resize((lw, lh), Image.LANCZOS), ((1200 - lw) // 2, (560 - lh) // 2 + 10))
    d = ImageDraw.Draw(card)
    d.rectangle((0, 590, 600, 630), fill=(11, 74, 155))
    d.rectangle((600, 590, 1200, 630), fill=(58, 166, 53))
    card.save(OUT / "social-share-v2.png", optimize=True)
    print("Done.")


if __name__ == "__main__":
    main()
