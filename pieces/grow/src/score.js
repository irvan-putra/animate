  // =====================================================================
  //  SCORE BODY — runs inside buildScore() (kit/score-head.js). to = 'm' (music) or 's' (sfx).
  //  Arc: thin and gentle in the seed era, fuller in the rain, fullest on the tree, a hard stop
  //  for the hush at 11.5–12.0, then the payoff: a stab + sub on 12.0 and a warm flat chord after.
  //  The motif (a rising fifth) plays whenever something is planted or sprouts.
  // =====================================================================
  const T = TIMELINE, cu = T.cues;
  to = 'm';
  // 1 Seed: a soft pad; the motif as the seed lands
  pad(0.0, 4.1, ['G3', 'D4', 'B4'], 0.035, { type: 'triangle', cut: 800, att: 0.05, rel: 0.2 });
  [['G4', 0], ['D5', E8]].forEach(([n, dt], i) => pluck(cu.plant + dt, nz(n), 0.2, 0.1 - i * 0.1, 0.6, 2600, 0.35));
  pluck(cu.worm, nz('A4'), 0.08, 0.2, 0.3, 3200, 0.3);   // the worm's hello
  // 2 Rain: patter plucks over a wider pad; the motif a third up when the sprout pops
  pad(4.0, 8.05, ['C3', 'G3', 'E4'], 0.042, { cut: 1000, att: 0.3, rel: 0.3, send: 0.4 });
  for (let i = 0; i < 12; i++) pluck(cu.rain + i * 0.25, nz(['C6', 'E6', 'G6', 'A6'][i % 4]), 0.045, 0.4 - (i % 4) * 0.2, 0.3, 5200, 0.35);
  [['E4', 0], ['B4', E8], ['E5', 2 * E8]].forEach(([n, dt], i) => pluck(cu.sprout + dt, nz(n), 0.18, -0.05 * i, 0.5, 3000, 0.35));
  // 3 Tree: the fullest section — wide pad, bass, bird blips, blossom chimes, one pluck for the fruit
  pad(8.0, 11.55, ['C3', 'G3', 'C4', 'E4'], 0.04, { cut: 1400, att: 0.3, rel: 0.25 });
  for (let i = 0; i < 4; i++) bass(8.0 + i * 1.0, nz('C2'), 0.13);
  for (let i = 0; i < 3; i++) blip(cu.birds + i * 0.45, 2200 + i * 260, 3000 + i * 260, 0.14, 0.05);
  for (let i = 0; i < 5; i++) chime(cu.blossoms + i * 0.15, [nz('E6')], 0.04);
  pluck(cu.fruit, nz('A5'), 0.15, 0, 0.35, 3000, 0.3);
  // 4 Hush: nothing — every event ends by 11.55.
  // 5 Again: the payoff on 12.0, then a warm flat chord; the motif returns, slower
  pluck(cu.gift, nz('C4'), 0.3, 0, 0.4, 2200, 0.2);
  pluck(cu.gift, nz('E4'), 0.26, -0.1, 0.4, 2400, 0.2);
  pluck(cu.gift, nz('G4'), 0.26, 0.1, 0.4, 2400, 0.2);
  sub(cu.gift, 0.6);
  pad(12.35, 16.05, ['F3', 'C4', 'F4', 'A4'], 0.058, { cut: 1200, att: 0.4, rel: 0.4, send: 0.3 });
  [['G4', 0], ['D5', BEAT], ['G5', 2 * BEAT]].forEach(([n, dt], i) => pluck(13.6 + dt, nz(n), 0.14, 0.1 - i * 0.1, 0.6, 2800, 0.35));
  pluck(cu.leaf, nz('E6'), 0.1, 0.15, 0.3, 4200, 0.3);
  to = 's';
  sweep(3.7, 4.05, 0.011, 500, 2600, 0);    // a paper swish into each morph
  sweep(7.7, 8.05, 0.011, 500, 2600, 0);
  sweep(11.7, 12.05, 0.011, 500, 2600, 0);
