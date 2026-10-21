# Official Airzone artwork

Only the company's supplied artwork is used. Originals stay unchanged in
`attached_assets/`; website files are generated from them.

| Brand | Source file (original name) | Original pixels | Website treatment |
| --- | --- | --- | --- |
| Airzone Group (master identity) | `airzone_group_logo_1791705665605.png` ("airzone group logo.png") | 1738 × 905 | Empty white margins trimmed; proportional resize to 240/480/960 px (WebP + PNG); 1200 px PNG for structured data |
| Airzone Logistics Services Est | `airzone_logo_1791705278769.png` ("airzone logo.png", letterhead) | 2170 × 725 | English name and globe only (same composition as the previously approved crop); Arabic registration panel and full-width rule excluded; 320/640/1280 px |
| Airzone Travel and Tourism | `Airzone_travel_Logo_1791705915645.jpg` | 997 × 1024 | Margins trimmed; 160/320/640 px |

Processing is deterministic (trim, proportional Lanczos resize, format
conversion). Nothing is traced, retyped, recoloured or redrawn. The artwork has
a white canvas; on dark surfaces (footer, about cards) logos sit on a white
plate rather than being colour-keyed, because the dark "GROUP" lettering would
disappear on navy.

## Browser icons (favicon)

Decision confirmed with the business owner (11 Oct 2026): the browser tab icon
uses the **Airzone Group** logo ("airzone group logo.png"), not the Logistics
letterhead file named "airzone logo.png".

* Whole logo centred in a white disc with transparent corners. The scale is the
  largest at which essentially none of the logo's ink touches the disc edge, so
  nothing is cropped or distorted.
* 16/32/48 px variants are rendered individually with light sharpening;
  `favicon-v2.ico` and `/favicon.ico` embed 16, 32 and 48 px.
* `favicon-v2-96.png` and `favicon-v2-192.png` (multiples of 48 px, as Google
  Search requires for site favicons), `apple-touch-icon-v2.png` (opaque, 180 px)
  and PWA icons `icon-v2-192/512.png` plus a maskable 512 px icon.
* Filenames carry a version (`v2`) so browsers do not keep showing the previous
  cached icon. Bump `ICON_VERSION` in the script for any future change.
* Social sharing card: `social-share-v2.png` (1200 × 630, logo on white).

Regenerate all logo and icon files with:

```
pip install pillow
python scripts/prepare-brand-assets.py
```

Google decides when to refresh the favicon shown in search results; publishing
these files does not update search results immediately.
