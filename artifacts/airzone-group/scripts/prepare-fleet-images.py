"""Normalise the supplied fleet photos onto one studio colour for the homepage showroom.

Usage (from the repo root):
  python artifacts/airzone-group/scripts/prepare-fleet-images.py attached_assets/fleet artifacts/airzone-group/public/assets/fleet

For each photo: estimate the studio background everywhere (Coons patch from the four borders),
map it to one stage colour while keeping shadows and highlights in proportion, align the wheel
line, feather only the outermost frame edge, and write WebP sizes. The vehicles are not edited.
"""
import os
import sys
from PIL import Image, ImageMath, ImageChops

SLUGS = ['curtainside', 'flatbed', 'lowbed', 'car-carrier', 'dayana-reefer', 'dayana-box', 'dayana-open', 'cargo-van', 'suzuki-carry']
SRC = {f'{slug}-original.jpg': slug for slug in SLUGS}
STAGE = (236, 238, 240)          # must match --az-stage (#eceef0) in src/styles/airzone.css
W, H = 1024, 572
BASELINE = 528                    # bottom of the vehicle (tyres and contact shadow)
G = 8                             # grid cell for the background estimate


def smooth(seq, k=4):
    out = []
    for i in range(len(seq)):
        win = seq[max(0, i - k):i + k + 1]
        out.append(sum(win) / len(win))
    return out


def background_field(ch):
    """Smooth background estimate for one channel ('L' image), returned as an 'F' image."""
    gw, gh = W // G, H // G
    g = ch.resize((gw, gh), Image.BOX)
    px = g.load()
    rows = 2
    top = smooth([sum(px[x, y] for y in range(rows)) / rows for x in range(gw)])
    bot = smooth([sum(px[x, gh - 1 - y] for y in range(rows)) / rows for x in range(gw)])
    left = smooth([sum(px[x, y] for x in range(rows)) / rows for y in range(gh)])
    right = smooth([sum(px[gw - 1 - x, y] for x in range(rows)) / rows for y in range(gh)])
    c00, c10, c01, c11 = top[0], top[-1], bot[0], bot[-1]
    field = Image.new('F', (gw, gh))
    fp = field.load()
    for y in range(gh):
        v = y / (gh - 1)
        for x in range(gw):
            u = x / (gw - 1)
            coons = ((1 - v) * top[x] + v * bot[x] + (1 - u) * left[y] + u * right[y]
                     - ((1 - u) * (1 - v) * c00 + u * (1 - v) * c10 + (1 - u) * v * c01 + u * v * c11))
            fp[x, y] = min(250.0, max(120.0, coons))
    return field.resize((W, H), Image.BILINEAR)


def normalise(im):
    bands = []
    for ch, s in zip(im.split(), STAGE):
        b = background_field(ch)
        v = ch.convert('F')
        out = ImageMath.lambda_eval(
            lambda a: a['min'](a['v'], a['b']) * s / a['b'] + a['max'](a['v'] - a['b'], 0) * (255 - s) / (255 - a['b']),
            v=v, b=b)
        bands.append(out.convert('L'))
    return Image.merge('RGB', bands)


def vehicle_bbox(im):
    stage = Image.new('RGB', im.size, STAGE)
    diff = ImageChops.difference(im, stage).convert('L').point(lambda p: 255 if p > 22 else 0)
    return diff.getbbox()


def feather_mask(w, h, side=26, top=34, bottom=34):
    mask = Image.new('L', (w, h), 255)
    mp = mask.load()
    for y in range(h):
        fy = min(1.0, y / top, (h - 1 - y) / bottom)
        for x in range(w):
            f = min(fy, x / side, (w - 1 - x) / side)
            if f < 1.0:
                mp[x, y] = int(255 * max(0.0, f))
    return mask


def main(src_dir, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    mask = feather_mask(W, H)
    report = []
    for fname, slug in SRC.items():
        im = Image.open(os.path.join(src_dir, fname)).convert('RGB').resize((W, H), Image.LANCZOS)
        norm = normalise(im)
        box = vehicle_bbox(norm)
        dx = (W - (box[0] + box[2])) // 2          # centre horizontally
        dy = BASELINE - box[3]                     # align the wheel line
        canvas = Image.new('RGB', (W, H), STAGE)
        canvas.paste(norm, (dx, dy))
        final = Image.composite(canvas, Image.new('RGB', (W, H), STAGE), mask)
        final.save(os.path.join(out_dir, f'{slug}-1024.webp'), 'WEBP', quality=84, method=6)
        final.resize((640, 358), Image.LANCZOS).save(os.path.join(out_dir, f'{slug}-640.webp'), 'WEBP', quality=82, method=6)
        final.resize((240, 134), Image.LANCZOS).save(os.path.join(out_dir, f'{slug}-240.webp'), 'WEBP', quality=80, method=6)
        nb = vehicle_bbox(final)
        report.append(f'{slug}: source bbox {box}, shift ({dx},{dy}), final bbox {nb}, width share {round((nb[2]-nb[0])/W*100)}%')
    print('\n'.join(report))


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
