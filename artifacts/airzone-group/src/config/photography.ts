/**
 * Editorial photography (Wikimedia Commons). Credits are also listed in docs/photo-credits.md.
 * These are illustrative, third-party images. They do not depict Airzone staff, offices, clients or shipments.
 */
export type Photo = {
  base: string;
  width: number;
  height: number;
  alt: string;
  credit: string;
  license: string;
  source: string;
};

const widths = [800, 1400, 1920] as const;

export const photos = {
  portCranes: {
    base: 'port-cranes', width: 2048, height: 1365,
    alt: 'Ship-to-shore cranes standing over a container terminal',
    credit: 'Robinson Niñal / Presidential Photojournalists Division (PPD)', license: 'Public domain',
    source: 'https://commons.wikimedia.org/wiki/File:Ship-to-shore_cranes_at_the_Davao_International_Container_Terminal.jpg',
  },
  containerShip: {
    base: 'container-ship', width: 1920, height: 1280,
    alt: 'A loaded container ship moored at a port quay',
    credit: 'Martin Dörsch', license: 'CC0',
    source: 'https://commons.wikimedia.org/wiki/File:Container_ship_in_Koper_2013.jpg',
  },
  maldives: {
    base: 'maldives-resort', width: 1920, height: 1010,
    alt: 'Overwater villas on a turquoise lagoon in the Maldives',
    credit: 'Dr. Ondřej Havelka', license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Maldives_Resort,_Indian_Ocean.jpg',
  },
  riyadh: {
    base: 'riyadh-skyline', width: 1920, height: 1080,
    alt: 'The Riyadh skyline at dusk',
    credit: 'B.alotaby', license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Riyadh_Skyline.jpg',
  },
} satisfies Record<string, Photo>;

export function photoUrl(photo: Photo, w: (typeof widths)[number]) {
  return `${import.meta.env.BASE_URL}assets/photo/${photo.base}-${w}.webp`;
}
export function photoSrcSet(photo: Photo) {
  return widths.map(w => `${photoUrl(photo, w)} ${w}w`).join(', ');
}
