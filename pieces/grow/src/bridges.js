// =====================================================================
//  ERAS, CAMERAS, BRIDGES — read by kit/morph.js
//  ERA_BG: each era's dominant colour (the fade to blank paper during a morph).
//  pieceCam(era, t): null, push(t, a, b, { z, p, to }, pullA, pullB) or bump(t, t0, [x, y]).
//  BRIDGES: at tc the object A (end of the old era) morphs into B (start of the new one).
//    shape = { P: points, c: '#hex' } or SP(x, y, r, rays) for the spark hero itself.
// =====================================================================
const ERA_BG = ['#cfe2ee', '#3f9f9a', '#f6cf55', '#f3ead6'];
function pieceCam(era, t) {   // a soft heartbeat on the gift: a gentle zoom pulse centred on the new seed
  if (era === 3) return bump(t, 12.0, [540, 1045], 0.05, 1.0);
  return null;
}
const BRIDGES = [
  { tc: 4.0,  A: () => ({ P: ellipsePts(800, 380, 95, 95, 0, 64), c: PAL.yellow }),     B: () => ({ P: ellipsePts(800, 380, 175, 105, 0, 64), c: PAL.snow }) },   // the sun -> the rain cloud
  { tc: 8.0,  A: () => ({ P: ellipsePts(800, 380, 175, 105, 0, 64), c: PAL.snow }),     B: () => ({ P: ellipsePts(540, 740, 270, 215, 0, 64), c: PAL.green }) },   // the cloud -> the tree's crown
  { tc: 12.0, A: () => ({ P: ellipsePts(690, 880, 110, 105, 0, 64), c: PAL.pink }),     B: () => ({ P: ellipsePts(540, 1045, 95, 125, 0.1, 64), c: PAL.woodL }) }, // the fruit -> the new seed
];
