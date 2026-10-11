#!/usr/bin/env bash
set -euo pipefail

# Deterministic processing only: no tracing, retyping, recolouring or AI redraw.
# Originals remain in attached_assets. All three sources have opaque white canvases.
out="artifacts/airzone-group/public/assets/brand"
mkdir -p "$out"
magick attached_assets/image_1791693537010.png -fuzz 3% -trim +repage \
  -bordercolor white -border 6 -filter Lanczos -resize 184x116 \
  -unsharp 0x0.6+0.25+0.02 -strip "$out/airzone-group-logo.png"
magick attached_assets/image_1791693537010.png -fuzz 3% -trim +repage \
  -bordercolor white -border 6 -filter Lanczos -resize 368x232 \
  -unsharp 0x0.6+0.25+0.02 -strip "$out/airzone-group-logo@2x.png"
magick attached_assets/image_1791693486305.png -fuzz 3% -trim +repage \
  -bordercolor white -border 6 -strip "$out/airzone-travel-logo.png"
magick attached_assets/image_1791693486305.png -fuzz 3% -trim +repage \
  -bordercolor white -border 6 -filter Lanczos -resize 392x324 \
  -unsharp 0x0.6+0.2+0.02 -strip "$out/airzone-travel-logo@2x.png"
# User-approved Logistics crop: English name and globe only.
magick attached_assets/image_1791694690225.png \
  -strip "$out/airzone-logistics-logo.png"
magick attached_assets/image_1791694690225.png -filter Lanczos -resize 824x224 \
  -unsharp 0x0.6+0.2+0.02 -strip \
  "$out/airzone-logistics-logo@2x.png"

for size in 16 32 180 192 512; do
  magick "$out/airzone-group-logo@2x.png" -filter Lanczos \
    -resize "$((size * 9 / 10))x$((size * 9 / 10))" \
    -background white -gravity center -extent "${size}x${size}" \
    -strip "$out/favicon-${size}.png"
done
magick "$out/favicon-16.png" "$out/favicon-32.png" "$out/favicon.ico"

favicon_source="$(mktemp --suffix=.png)"
trap 'rm -f "$favicon_source"' EXIT
magick attached_assets/image_1791693537010.png -fuzz 3% -trim +repage \
  -bordercolor white -border 6 -strip "$favicon_source"
python - "$favicon_source" <<'PY'
import base64
import sys
from pathlib import Path
out = Path("artifacts/airzone-group/public/assets/brand")
data = base64.b64encode(Path(sys.argv[1]).read_bytes()).decode("ascii")
# SVG is a container for the supplied raster artwork, NOT a claimed vector redraw.
(out / "favicon.svg").write_text(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
    '<rect width="64" height="64" fill="white"/>'
    f'<image x="3" y="14" width="58" height="37" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,{data}"/>'
    '</svg>'
)
PY
