#!/usr/bin/env bash
set -euo pipefail

# Browser icons only. Preserve the official Group artwork and its proportions.
out="artifacts/airzone-group/public/assets/brand"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
mkdir -p "$out"
magick attached_assets/image_1791693537010.png -fuzz 3% -trim +repage \
  -strip "$tmp/logo.png"

# The entire trimmed logo fits inside a white circle. Only the canvas outside
# that circle is transparent; no brand colours or internal pixels are erased.
magick "$tmp/logo.png" -filter Lanczos -resize 430x430 \
  -background white -gravity center -extent 512x512 "$tmp/square.png"
magick -size 1024x1024 xc:black -fill white \
  -draw 'circle 511.5,511.5 511.5,0.5' -filter Lanczos -resize 512x512 \
  "$tmp/mask.png"
magick "$tmp/square.png" "$tmp/mask.png" -alpha off \
  -compose CopyOpacity -composite "$tmp/circle.png"
for size in 16 32 48; do
  magick "$tmp/circle.png" -filter Lanczos -resize "${size}x${size}" \
    -depth 8 -strip "PNG32:$out/favicon-circle-v1-${size}.png"
done
magick "$out/favicon-circle-v1-16.png" "$out/favicon-circle-v1-32.png" \
  "$out/favicon-circle-v1-48.png" "$out/favicon-circle-v1.ico"

python - "$tmp/logo.png" "$out" <<'PY'
import base64
import sys
from pathlib import Path
data = base64.b64encode(Path(sys.argv[1]).read_bytes()).decode("ascii")
# A circular SVG container for the authentic raster, not a vector redraw.
(Path(sys.argv[2]) / "favicon-circle-v1.svg").write_text(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
    '<defs><clipPath id="disc"><circle cx="32" cy="32" r="32"/></clipPath></defs>'
    '<g clip-path="url(#disc)"><circle cx="32" cy="32" r="32" fill="#fff"/>'
    f'<image x="5" y="16.5" width="54" height="31" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,{data}"/>'
    '</g></svg>'
)
PY

# Remove obsolete generated browser icons; retain opaque Apple/PWA icons.
rm -f "$out/favicon-16.png" "$out/favicon-32.png" \
  "$out/favicon.ico" "$out/favicon.svg"
