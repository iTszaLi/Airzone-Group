import type { FrameSet } from './frame-sequence';

const base = import.meta.env.BASE_URL;
/** URL of a file in public/assets/cinematic. */
export const cine = (name: string) => `${base}assets/cinematic/${name}`;

// Frame sets produced by scripts/prepare-cinematic-frames.py from the supplied
// animation (attached_assets/new1.webp). Landscape = full frames, portrait =
// their centre column (all a tall screen ever shows), every second frame.
// Rows 85-633 are the picture area while the clip's letterbox is present
// (it has faded by frame 105); after that the crop eases out to full height.
// Shared by the homepage opening and the travel hero, so a visitor downloads them once.
export const CINEMATIC_SETS: Record<'d' | 'm', FrameSet> = {
  d: { url: i => cine(`d/${String(i).padStart(3, '0')}.webp`), count: 192, width: 1280, height: 720, band: { top: 85, bottom: 633, cleanFrom: 105 } },
  m: { url: i => cine(`m/${String(i).padStart(3, '0')}.webp`), count: 96, width: 720, height: 720, band: { top: 85, bottom: 633, cleanFrom: 53 } },
};
/** Viewports narrower than this aspect ratio use the portrait set. */
export const PORTRAIT_QUERY = '(max-aspect-ratio: 5/4)';
