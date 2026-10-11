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

for size in 180 192 512; do
  magick "$out/airzone-group-logo@2x.png" -filter Lanczos \
    -resize "$((size * 9 / 10))x$((size * 9 / 10))" \
    -background white -gravity center -extent "${size}x${size}" \
    -strip "$out/favicon-${size}.png"
done
bash scripts/prepare-favicons.sh
