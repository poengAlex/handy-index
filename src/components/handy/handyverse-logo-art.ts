// The Handyverse logo, as three lockups (design.md 5.1): the pictogram with
// the wordmark, the wordmark alone, and the pictogram alone. The pictogram is
// the mark with a play button set into a round cut-out, on the mark's own
// artboard, so it takes the place of `mark` at the same height. The supplied
// masters are normalised to currentColor and the lockups tightly cropped for
// HLogo's height-based sizing. The lockup reuses the pictogram's and the
// wordmark's own paths, placed as the masters place them, in the wordmark's
// coordinates.
//
// Earlier concepts are retired: V1 and V4 (with "the") and the numbered names
// V2 and V3, which are the first two lockups. The old names still render,
// mapped to the nearest current lockup, so an app that hasn't moved yet keeps
// a logo.

export type HandyverseLogoVariant =
  | "handyverse" // the pictogram + "handyverse"
  | "handyverse-wordmark" // "handyverse" only
  | "handyverse-mark" // the pictogram only
  // old names, deprecated: each renders the lockup after the arrow
  | "handyverse-v2-horizontal" // → handyverse
  | "handyverse-v3-horizontal" // → handyverse-wordmark
  | "handyverse-v1-horizontal" // retired "the handyverse" → handyverse
  | "handyverse-v1-stacked" // retired "the handyverse" → handyverse
  | "handyverse-v4-horizontal" // retired "the handyverse" → handyverse-wordmark
  | "handyverse-v4-stacked"; // retired "the handyverse" → handyverse-wordmark

// the pictogram, on the mark's artboard (0 0 105.64 142.88)
const pictogram = `<path d="M 49.96 28.13 L 49.96 50.521546105 A 30.95 30.95 0 0 0 49.96 112.157622391 L 49.96 114.36 C 49.96 127.62 38.99 138.46 25.75 137.85 C 13.42 137.24 3.73 127.08 3.69 114.74 L 3.69 28.48 C 3.7 15.99 13.45 5.5 25.92 5.02 C 38.72 4.55 49.48 14.55 49.95 27.35 C 49.95 27.61 49.96 27.87 49.97 28.13 L 49.96 28.13 Z"/>
    <path d="M 101.93 83.41 L 101.93 135.52 L 55.67 135.52 L 55.67 112.157622391 A 30.95 30.95 0 0 0 75.686480231 60.487776363 C 76.704850342 60.350750864 77.744187993 60.28 78.8 60.28 C 91.57 60.28 101.93 70.64 101.93 83.41 Z"/>
    <path d="M 70.0575 80.103332984 A 1.4275 1.4275 0 0 1 70.0575 82.575835512 L 45.264375 96.890152905 A 1.4275 1.4275 0 0 1 43.123125 95.653901641 L 43.123125 67.025266855 A 1.4275 1.4275 0 0 1 45.264375 65.789015591 Z"/>`;

// "handy" in the bold brand lettering, "verse" in its lighter outlines
const lettering = `<g>
    <path d="M159.17,161.36v13.42h-6.06v-12.13c0-3.05-1.5-4.9-3.87-4.9-3.06,0-5.16,2.06-5.16,5.93v11.1h-6.06v-29.82h6.06v12.03c1.38-3.1,3.87-4.52,7.01-4.52,5.2-.02,8.08,3.55,8.08,8.89h0Z"/>
    <path d="M178.83,152.97v3.08h-.05c-1.06-2.23-3.76-3.55-6.71-3.55-6.2,0-10.04,4.62-10.04,11.2s3.85,11.45,10.04,11.45c2.9,0,5.55-1.45,6.71-3.8h.05v3.34h6.02v-21.72h-6.02ZM179,163.91c0,3.94-2.27,6.41-5.55,6.4-3.21,0-5.47-2.53-5.47-6.62,0-3.84,2.26-6.37,5.47-6.37s5.55,2.48,5.55,6.33v.26Z"/>
    <path d="M209.64,161.35v13.34h-6.02v-12.05c0-3.03-1.5-4.87-3.85-4.87-3.04,0-5.13,2.05-5.13,5.89v11.03h-6.02v-21.71h6.02v4.03c1.37-3.08,3.85-4.49,6.97-4.49,5.17-.02,8.03,3.53,8.03,8.83h0Z"/>
    <path d="M229.91,145.06v11h-.04c-1.07-2.23-4.03-3.55-6.97-3.55-6.2,0-10.04,4.62-10.04,11.2s3.87,11.45,10.07,11.45c2.9,0,5.85-1.45,6.96-3.8h.04v3.34h6.01v-29.63h-6.03ZM229.82,163.91c0,3.94-2.27,6.41-5.55,6.41s-5.47-2.53-5.47-6.62h0c0-3.85,2.27-6.37,5.46-6.38,3.28,0,5.55,2.48,5.55,6.33v.26h0Z"/>
    <path d="M260.98,176.21c0,5.47-4.5,9.1-10.74,9.1s-10.43-2.99-10.98-8.29h6.11c.47,2.18,2.27,3.67,4.84,3.67,2.74,0,4.74-1.75,4.74-4.15v-6.73c-1.37,2.86-3.81,4.19-6.79,4.19-4.96,0-8.21-3.33-8.21-9.19v-11.83h6.03v10.86c0,3.08,1.45,4.92,3.85,4.92,3.03,0,5.13-2.09,5.13-5.9v-9.87h6.03v23.23h0Z"/>
  </g>
  <g>
    <path d="M273.01,174.65l-9.06-21.68h3.6l8.84,21.68h-3.38ZM273.23,174.65l8.84-21.68h3.64l-9.06,21.68h-3.42Z"/>
    <path d="M297.26,175.17c-2.11,0-3.97-.48-5.59-1.45s-2.88-2.3-3.79-4.01-1.37-3.67-1.37-5.9.45-4.19,1.37-5.9,2.17-3.04,3.77-4.01c1.6-.97,3.45-1.45,5.53-1.45s3.77.5,5.25,1.49c1.47,1,2.62,2.39,3.42,4.18.81,1.79,1.21,3.9,1.21,6.33h-17.9l.87-.74c0,1.73.31,3.22.93,4.46s1.5,2.19,2.62,2.84c1.13.65,2.41.98,3.86.98,1.53,0,2.82-.36,3.88-1.08s1.87-1.68,2.45-2.86l2.99,1.52c-.55,1.13-1.28,2.11-2.19,2.95s-1.98,1.49-3.21,1.95c-1.23.46-2.59.69-4.1.69h0ZM290.23,162.25l-.91-.69h14.96l-.91.74c0-1.39-.27-2.59-.82-3.6-.55-1.01-1.29-1.79-2.21-2.34s-1.99-.82-3.21-.82-2.31.28-3.36.82-1.91,1.32-2.56,2.32-.98,2.19-.98,3.58h0Z"/>
    <path d="M311.01,174.65v-21.68h3.47v21.68h-3.47ZM312.92,162.9c0-2.34.45-4.24,1.34-5.7.9-1.46,2.04-2.54,3.45-3.25,1.4-.71,2.88-1.06,4.44-1.06v3.25c-1.27,0-2.49.21-3.66.63s-2.13,1.11-2.88,2.06-1.13,2.25-1.13,3.9l-1.56.17Z"/>
    <path d="M332.77,175.17c-1.59,0-2.98-.24-4.16-.72-1.19-.48-2.18-1.1-2.97-1.89-.8-.78-1.37-1.63-1.71-2.56l3.03-1.26c.49.98,1.23,1.78,2.21,2.38.98.61,2.07.91,3.25.91,1.36,0,2.5-.27,3.42-.8s1.39-1.29,1.39-2.28c0-.9-.34-1.62-1.02-2.17s-1.68-1-3.01-1.34l-2.08-.56c-1.97-.52-3.5-1.31-4.6-2.36-1.1-1.06-1.65-2.25-1.65-3.58,0-2.05.67-3.65,2.02-4.79,1.34-1.14,3.34-1.71,6-1.71,1.27,0,2.43.19,3.47.56,1.04.38,1.94.9,2.69,1.58.75.68,1.3,1.48,1.65,2.41l-3.03,1.34c-.38-.98-1-1.69-1.86-2.12-.87-.43-1.92-.65-3.17-.65-1.33,0-2.37.28-3.12.85s-1.13,1.35-1.13,2.36c0,.58.31,1.12.93,1.63s1.54.92,2.75,1.24l2.17.56c1.42.35,2.6.86,3.55,1.54s1.68,1.45,2.17,2.32c.49.87.74,1.79.74,2.77,0,1.3-.35,2.43-1.04,3.38-.69.95-1.63,1.68-2.82,2.19-1.19.51-2.54.76-4.07.76h0Z"/>
    <path d="M354.18,175.17c-2.11,0-3.97-.48-5.59-1.45s-2.88-2.3-3.79-4.01c-.91-1.7-1.37-3.67-1.37-5.9s.46-4.19,1.37-5.9c.91-1.7,2.17-3.04,3.77-4.01,1.6-.97,3.45-1.45,5.53-1.45s3.77.5,5.25,1.49c1.47,1,2.61,2.39,3.42,4.18.81,1.79,1.21,3.9,1.21,6.33h-17.9l.87-.74c0,1.73.31,3.22.93,4.46s1.5,2.19,2.62,2.84c1.13.65,2.41.98,3.86.98,1.53,0,2.82-.36,3.88-1.08,1.05-.72,1.87-1.68,2.45-2.86l2.99,1.52c-.55,1.13-1.28,2.11-2.19,2.95s-1.98,1.49-3.21,1.95c-1.23.46-2.59.69-4.1.69h0ZM347.17,162.25l-.91-.69h14.96l-.91.74c0-1.39-.28-2.59-.82-3.6-.55-1.01-1.29-1.79-2.21-2.34-.93-.55-1.99-.82-3.21-.82s-2.31.28-3.36.82c-1.06.55-1.91,1.32-2.56,2.32s-.98,2.19-.98,3.58h0Z"/>
  </g>`;

const handyverse = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="82 120 284 68" fill="currentColor">
  <g transform="translate(83.9896 174.78) scale(0.39963737) translate(-3.69 -137.87454678)">
    ${pictogram}
  </g>
  ${lettering}
</svg>`;

const handyverseWordmark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="137 143 229 45" fill="currentColor">
  ${lettering}
</svg>`;

const handyverseMark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 105.64 142.88" fill="currentColor">
  ${pictogram}
</svg>`;

export const handyverseLogoArt: Record<HandyverseLogoVariant, string> = {
  handyverse,
  "handyverse-wordmark": handyverseWordmark,
  "handyverse-mark": handyverseMark,
  "handyverse-v2-horizontal": handyverse,
  "handyverse-v3-horizontal": handyverseWordmark,
  "handyverse-v1-horizontal": handyverse,
  "handyverse-v1-stacked": handyverse,
  "handyverse-v4-horizontal": handyverseWordmark,
  "handyverse-v4-stacked": handyverseWordmark
};
