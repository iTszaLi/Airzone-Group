"""Build the scroll-driven homepage opening from the supplied airplane animation.

Sources (never modified):
* attached_assets/Scroll_driven_airplane_animation_.mp4 - the clip as H.264,
  1280 x 720, 24 fps, 8 s (192 frames), ~4.9 Mbit/s. Preferred source.
* attached_assets/new1.webp - the same clip as an animated WebP (fallback).
* attached_assets/im1.png - 1915 x 821 still that the clip opens on (it matches
  frame 0's picture area almost pixel for pixel, at 1.5x the resolution).
* attached_assets/im3.png - 1672 x 941 still of the closing composition.

No higher-resolution master exists: both video files are 1280 x 720. Measured
in October 2026, the MP4 frames are the cleaner of the two: the animated WebP
has visible 8 x 8 block artefacts in flat areas (the aircraft fuselage, sky),
which H.264's deblocking filter removes, and the MP4's frame 0 is closer to the
sharp still (34.45 vs 34.11 dB PSNR). Every MP4 frame was checked to align with
the WebP frame of the same index.

Frames are extracted unchanged (no retouching, sharpening or regeneration) so
the homepage can draw them on a canvas in step with scrolling. Python cannot
decode H.264, so the MP4 is first decoded to a lossless PNG sequence, e.g.

    ffmpeg -i attached_assets/Scroll_driven_airplane_animation_.mp4 -start_number 0 frames/%03d.png

and passed with --frames frames. (The October 2026 build decoded the frames
with Chrome, seeking each frame and reading it back losslessly; ffmpeg gives the
same RGB frames.) Without --frames the animated WebP is used.

The first part of the clip has a baked-in letterbox (black bars above row 85
and below row 633) that fades out between frames ~63 and ~104. Frames are
stored at full height and the page crops them at draw time: the letterbox band
until frame 104, then gradually the full 720 rows, which gives later frames
about 30% more real detail on screen.

Outputs (artifacts/airzone-group/public/assets/cinematic/):
* d/   landscape set, 1280 x 720, every frame (desktop, tablet landscape)
* m/   portrait set, centre 720 x 720, every second frame (phones, tablet
       portrait), where only the middle of the picture is ever visible
* poster-d.webp / poster-m.webp / poster-p.webp (phones) - from im1.png: the sharp resting image shown
  at the top of the page, before scripts run and under reduced motion
* travel.webp - from im3.png, for the Airzone Travels panel

Usage (from the repository root):
    python scripts/prepare-cinematic-frames.py [--frames <dir of 000.png...>]
Requires Pillow (pip install pillow).
"""
import json
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "attached_assets/new1.webp"
OPENING = ROOT / "attached_assets/im1.png"
CLOSING = ROOT / "attached_assets/im3.png"
OUT = ROOT / "artifacts/airzone-group/public/assets/cinematic"

PORTRAIT = (280, 0, 1000, 720)  # centre 720 px column
# Encoding quality (measured October 2026 on the MP4 frames): the old q68 lost
# ~38 dB PSNR and showed ringing and blocking once frames were enlarged; q86
# keeps ~41 dB, free of visible blocks on flat areas such as the fuselage and
# visually matching the lossless frame, for ~100 KB per landscape frame.
QUALITY_D, QUALITY_M = 86, 84


def frames():
    """Yield (index, RGB frame): from a decoded PNG sequence if given, else the animated WebP."""
    if '--frames' in sys.argv:
        folder = Path(sys.argv[sys.argv.index('--frames') + 1])
        files = sorted(folder.glob('*.png'))
        if len(files) != 192:
            raise SystemExit(f'expected 192 PNG frames in {folder}, found {len(files)}')
        for i, f in enumerate(files):
            yield i, Image.open(f).convert('RGB')
        return
    im = Image.open(SRC)
    for i in range(im.n_frames):
        im.seek(i)
        yield i, im.convert('RGB')


def main() -> None:
    (OUT / "d").mkdir(parents=True, exist_ok=True)
    (OUT / "m").mkdir(parents=True, exist_ok=True)
    total_d = total_m = 0
    m_count = 0
    n = 0
    for i, frame in frames():
        if frame.size != (1280, 720):
            raise SystemExit(f'frame {i} is {frame.size}, expected 1280 x 720')
        d = OUT / "d" / f"{i:03d}.webp"
        frame.save(d, "WEBP", quality=QUALITY_D, method=6)
        total_d += d.stat().st_size
        if i % 2 == 0:
            mpath = OUT / "m" / f"{m_count:03d}.webp"
            frame.crop(PORTRAIT).save(mpath, "WEBP", quality=QUALITY_M, method=6)
            total_m += mpath.stat().st_size
            m_count += 1
        n += 1
    # im1 covers the letterbox band of frame 0 (1280 x 548) at 1915 x 821.
    still = Image.open(OPENING).convert("RGB")
    still.save(OUT / "poster-d.webp", "WEBP", quality=82, method=6)
    k = still.width / 1280
    x0 = round(PORTRAIT[0] * k)
    still.crop((x0, 0, still.width - x0, still.height)).save(OUT / "poster-m.webp", "WEBP", quality=82, method=6)
    # Phones (aspect <= 3:4) only ever see the middle ~640 px of the still.
    xp = (still.width - 640) // 2
    still.crop((xp, 0, xp + 640, still.height)).save(OUT / "poster-p.webp", "WEBP", quality=80, method=6)
    Image.open(CLOSING).convert("RGB").save(OUT / "travel.webp", "WEBP", quality=80, method=6)
    manifest = {"source": "attached_assets/Scroll_driven_airplane_animation_.mp4" if "--frames" in sys.argv else "attached_assets/new1.webp", "fps": 24, "band": [85, 633], "clean_from": 105,
                "d": {"count": n, "width": 1280, "height": 720}, "m": {"count": m_count, "width": 720, "height": 720}}
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"{n} frames: landscape {total_d / 1e6:.2f} MB, portrait ({m_count}) {total_m / 1e6:.2f} MB")


if __name__ == "__main__":
    main()
