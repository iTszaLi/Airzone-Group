# Official Airzone artwork

Only the user's supplied artwork is used. No vector originals or larger masters
were supplied. Sources are opaque PNGs:

| Brand | Original pixels | Treatment |
| --- | --- | --- |
| Airzone Group | 119 × 62 | Trim empty white margins; retain the complete artwork; mild Lanczos enlargement and restrained sharpening |
| Airzone Logistics | 412 × 112 | Use the user's approved crop containing only the English name and globe; exclude the Arabic registration-details panel |
| Airzone Travels & Tourism | 216 × 222 | Trim empty white margins; retain the artwork and white background; provide a restrained enlarged delivery |

The Group and Travel logos remain limited by their raster originals. Upscaling
does not restore missing detail. The SVG favicon embeds the original raster logo
inside an SVG container; it is not native vector artwork.

White canvases are intentional, especially on navy surfaces. Do not recolour,
invert, trace, retype or automatically erase the artwork. Prefer authentic vector
or high-resolution masters if the company provides them later.

Regenerate assets with `bash scripts/prepare-brand-assets.sh`.

## Circular browser favicon

Browser icons use the complete Group logo centred in a white circular disc with
transparent pixels outside the circle. The source proportions and brand colours
are preserved. The 16, 32 and 48 pixel PNGs, multi-size ICO and circular SVG
container have distinct `favicon-circle-v1` filenames to bypass the previous
square icon's browser cache. Future favicon revisions should use a new filename
version. No browser-icon CSS masking is used.

Regenerate only these browser icons with `bash scripts/prepare-favicons.sh`.
The separate Apple touch icon remains an opaque 180 × 180 PNG, allowing Apple to
apply its own icon mask. Existing PWA icons are unchanged.
