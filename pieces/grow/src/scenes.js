// =====================================================================
//  SCENES — one function per era, drawn in world coordinates (1080x1920), animated with TT / ev / popS.
//  Each scene: a full-bleed world, the spark acting (one more ray per era), 3+ details of background
//  life, a year tag and a caption. The bridge objects (sun, cloud, crown, fruit) sit where bridges.js expects them.
// =====================================================================

// a little bird in flight; x runs right to left while visible
function bird(x, y, s, key) {
  const flap = Math.sin(TT * 9 + key.length) * 7 * s;
  ink([[x - 22 * s, y], [x, y - 13 * s - flap], [x + 22 * s, y]], { w: 5 * s, color: PAL.ink, amt: 0.25, key: 'bird' + key });
}

// a five-petal flower, popped in with popS
function flower(x, y, s, k, key) {
  if (k <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  for (let p = 0; p < 5; p++) { const a = p / 5 * TAU; cut(ellipsePts(Math.cos(a) * 20 * s, Math.sin(a) * 20 * s, 16 * s, 11 * s, a, 14), PAL.pink, { key: key + 'p' + p, sb: 4 }); }
  cut(ellipsePts(0, 0, 11 * s, 11 * s, 0, 14), PAL.yellow, { key: key + 'm', shadow: false });
  ctx.restore();
}

function sceneSeed() {
  // the world: a spring garden wall, sun, drifting clouds, grass and a soil bed
  cut(rect(-30, -30, W + 60, H + 60, 0), PAL.sky, { key: 'wall1', shadow: false, tear: 0, shade: false, pat: pat.stripes('rgba(255,255,255,0.16)', 30, 90) });
  cut(ellipsePts(800, 380, 95, 95, 0, 36), PAL.yellow, { key: 'sun', crayon: '#e6b23a' });   // bridge object 1
  [[220, 330], [450, 270]].forEach(([x, y], i) => cut(ellipsePts(x + Math.sin(TT + i) * 10, y, 66, 26, 0, 20), '#ffffff', { key: 'cloud' + i, sb: 6 }));
  cut([[-40, 1180], [300, 1140], [700, 1190], [1120, 1150], [1120, 2000], [-40, 2000]], PAL.green, { key: 'grass1', sy: -4, pat: pat.stripes('rgba(255,255,255,0.12)', 4, 22, 0.3) });
  cut(ellipsePts(500, 1280, 370, 115, 0, 44), PAL.woodD, { key: 'soil', pat: pat.grainWood('rgba(60,30,10,0.25)') });
  // background life: a potted plant, a sleeping cat
  plant(170, 1120, 0.85, PAL.teal, 'pl1');
  cat(830, 1440, 0.8, PAL.charcoal, 'cat1');
  // the seed lands in the soil at the plant cue
  const k = popS(TIMELINE.cues.plant);
  if (k > 0) {
    cut(ellipsePts(500, 1295, 26, 18, 0, 18), PAL.woodD, { key: 'hole', shadow: false, grain: 0.4 });
    ctx.save(); ctx.translate(500, 1270); ctx.scale(k, k);
    cut(ellipsePts(0, 0, 44, 56, 0.15, 24), PAL.woodL, { key: 'seed', crayon: PAL.woodD, crAl: 0.35 });
    ctx.restore();
  }
  // a worm says hello
  const kw = popS(TIMELINE.cues.worm);
  if (kw > 0) {
    ctx.save(); ctx.translate(700, 1300); ctx.scale(kw, kw);
    cut(capsulePts(-45, 10, 30, -22, 34, 8), PAL.pink, { key: 'worm' });
    face(38, -28, 0.5, 'smile');
    ctx.restore();
  }
  // the hero watches, then is amazed
  spark(500, 1020, 92, { rays: 5, mood: TT < TIMELINE.cues.plant ? 'focus' : 'wow', key: 'hero', s: 0.7 + 0.3 * popS(0.3) });
  yearTag('spring');
  capStrip('a tiny seed');
}

function sceneRain() {
  // the world: a teal shower; the cloud hangs where the sun was
  cut(rect(-30, -30, W + 60, H + 60, 0), PAL.teal, { key: 'wall2', shadow: false, tear: 0, shade: false, pat: pat.stripes('rgba(255,255,255,0.10)', 4, 64, -0.4) });
  cut(ellipsePts(800, 380, 170, 95, 0, 36), PAL.snow, { key: 'cloudM', crayon: '#d8e6ee' });   // bridge object 2
  cut(ellipsePts(690, 415, 95, 62, 0, 28), PAL.snow, { key: 'cloudL' });
  cut(ellipsePts(910, 415, 95, 62, 0, 28), PAL.snow, { key: 'cloudR' });
  cut([[-40, 1180], [300, 1140], [700, 1190], [1120, 1150], [1120, 2000], [-40, 2000]], PAL.greenD, { key: 'grass2', sy: -4, pat: pat.stripes('rgba(255,255,255,0.10)', 4, 22, 0.3) });
  cut(ellipsePts(500, 1280, 370, 115, 0, 44), PAL.woodD, { key: 'soil2', pat: pat.grainWood('rgba(60,30,10,0.25)') });
  // rain: falling dashes until the shower passes
  if (TT < 7.5) {
    const R = RNG('rain');
    for (let i = 0; i < 16; i++) {
      const x = R.r(120, 960), y = 500 + mod(TT * 950 + i * 173, 720);
      ink([[x, y], [x - 7, y + 36]], { w: 5, color: 'rgba(255,255,255,0.65)', amt: 0.4, key: 'rain' + i });
    }
  }
  // mushrooms pop after the rain starts
  [[180, 1380, 0], [880, 1360, 1]].forEach(([x, y, i]) => {
    const km = popS(TIMELINE.cues.rain + 0.8 + i * 0.4); if (km <= 0) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(km, km);
    cut(rect(-16, -34, 32, 40, 8), PAL.paper, { key: 'mshs' + i });
    cut(arcPts(0, -30, 52, Math.PI, TAU, 18), PAL.pink, { key: 'mshc' + i, closed: false });
    ctx.restore();
  });
  // the sprout pops out of the soil
  const ks = popS(TIMELINE.cues.sprout);
  if (ks > 0) {
    ctx.save(); ctx.translate(500, 1270); ctx.scale(ks, ks);
    ink([[0, 10], [0, -110]], { w: 9, color: PAL.greenD, amt: 0.4, key: 'stem' });
    cut(rot(ellipsePts(-46, -120, 46, 20, 0, 18), -46, -120, -0.5), PAL.green, { key: 'leafL' });
    cut(rot(ellipsePts(46, -150, 46, 20, 0, 18), 46, -150, 0.5), PAL.green, { key: 'leafR' });
    ctx.restore();
  }
  spark(500, 980, 96, { rays: 6, mood: TT < TIMELINE.cues.sprout ? 'focus' : 'happy', key: 'hero' });
  yearTag('a shower');
  capStrip('it reaches up');
}

function sceneTree() {
  // the world: a warm yellow day; the tree stands where the rain fell
  cut(rect(-30, -30, W + 60, H + 60, 0), PAL.yellow, { key: 'wall3', shadow: false, tear: 0, shade: false, pat: pat.stripes('rgba(255,255,255,0.14)', 26, 100) });
  cut([[-40, 1180], [300, 1140], [700, 1190], [1120, 1150], [1120, 2000], [-40, 2000]], PAL.green, { key: 'grass3', sy: -4, pat: pat.stripes('rgba(255,255,255,0.12)', 4, 22, 0.3) });
  // the tree: trunk, then a crown of three tufts (the big one is bridge object 3)
  cut(rect(490, 900, 100, 420, 22), PAL.wood, { key: 'trunk', pat: pat.grainWood('rgba(120,60,20,0.25)') });
  cut(ellipsePts(540, 740, 270, 215, 0, 44), PAL.green, { key: 'crown', crayon: PAL.greenD, crAl: 0.3 });
  cut(ellipsePts(370, 830, 140, 110, 0, 30), PAL.greenD, { key: 'crownL' });
  cut(ellipsePts(710, 830, 140, 110, 0, 30), PAL.greenD, { key: 'crownR' });
  // birds cross the sky
  for (let i = 0; i < 3; i++) {
    const x = 1160 - (TT - TIMELINE.cues.birds - i * 0.7) * 300;
    if (x > -60 && x < 1140) bird(x, 400 + i * 70, 1 - i * 0.15, 'b' + i);
  }
  // blossoms pop on the crown
  [[430, 640], [660, 650], [540, 800], [350, 770], [730, 760]].forEach(([x, y], i) =>
    flower(x, y, 1, popS(TIMELINE.cues.blossoms + i * 0.15), 'bl' + i));
  // the fruit swells on the right branch (bridge object 4)
  const kf = popS(TIMELINE.cues.fruit);
  if (kf > 0) {
    ctx.save(); ctx.translate(690, 880); ctx.scale(kf, kf);
    cut(ellipsePts(0, 0, 110, 105, 0, 36), PAL.pink, { key: 'fruit', crayon: '#d47a96', crAl: 0.4 });
    cut(rot(ellipsePts(30, -116, 40, 16, 0, 16), 30, -116, 0.6), PAL.greenD, { key: 'fleaf' });
    ctx.restore();
  }
  // background life: the cat naps in the shade
  cat(190, 1400, 0.75, PAL.charcoal, 'cat3');
  // the hero, grown a ray, looks up at what the seed became
  spark(840, 1320, 62, { rays: 7, mood: 'wow', key: 'hero' });
  yearTag('years on');
  capStrip('it becomes a home');
}

function sceneAgain() {
  // the world: a warm room, a table, an open hand holding the new seed
  cut(rect(-30, -30, W + 60, H + 60, 0), PAL.cream, { key: 'wall4', shadow: false, tear: 0, shade: false, pat: pat.dots('rgba(216,180,120,0.22)', 4, 92) });
  cut(rect(-30, 1500, W + 60, 460, 0), PAL.pinkL, { key: 'table', sy: -4, pat: pat.gingham('rgba(255,255,255,0.30)', 26) });
  // background life: a stack of books, a potted plant
  books(870, 1450, 0.9, 'bk4');
  plant(160, 1470, 0.8, PAL.purple, 'pl4');
  // the open hand, reaching in from the left
  hand(460, 1180, 2.0, 0, PAL.skin2, PAL.teal, { key: 'hand4' });
  // the new seed resting on the palm (bridge object 4's counterpart)
  cut(ellipsePts(540, 1045, 95, 125, 0.1, 36), PAL.woodL, { key: 'seed4', crayon: PAL.woodD, crAl: 0.35 });
  // a fresh leaf pops from the seed: it starts again
  const kl = popS(TIMELINE.cues.leaf);
  if (kl > 0) {
    ctx.save(); ctx.translate(540, 918); ctx.scale(kl, kl);
    ink([[0, 6], [0, -42]], { w: 7, color: PAL.greenD, amt: 0.4, key: 'nstem' });
    cut(rot(ellipsePts(26, -52, 30, 13, 0, 16), 26, -52, 0.5), PAL.green, { key: 'nleaf' });
    ctx.restore();
  }
  // sparkles celebrate the gift, staggered across the whole era
  for (let i = 0; i < 6; i++) {
    const ks = popS(TIMELINE.cues.leaf + 0.2 + i * 0.42); if (ks <= 0) continue;
    sparkle(380 + (i % 4) * 110, 620 + (i % 3) * 130, 16 * ks, '#fff3c4');
  }
  // a butterfly drifts through late, so the held shot stays alive
  if (TT > 14.4) {
    const bx = 1150 - (TT - 14.4) * 340, by = 560 + Math.sin(TT * 3) * 40, flap = Math.sin(TT * 14) * 0.5;
    ctx.save(); ctx.translate(bx, by);
    cut(rot(ellipsePts(-20, 0, 24, 14, 0, 14), -20, 0, -0.5 - flap), PAL.purple, { key: 'bf1', sb: 4 });
    cut(rot(ellipsePts(20, 0, 24, 14, 0, 14), 20, 0, 0.5 + flap), PAL.purple, { key: 'bf2', sb: 4 });
    dot(0, 0, 7, PAL.ink);
    ctx.restore();
  }
  // the hero, one more ray, delighted
  spark(340, 860, 62, { rays: 8, mood: 'happy', key: 'hero' });
  yearTag('today');
  capStrip('and it starts again');
}
