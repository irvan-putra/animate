import argparse
from pathlib import Path
import numpy as np, wave, struct

SR = 48000
DUR = 16.0
N = int(SR * DUR)
t = np.arange(N) / SR
mix = np.zeros(N, dtype=np.float64)

def adsr_env(t0, dur, att=0.01, rel=0.3, peak=1.0):
    """simple attack/decay-to-zero envelope starting at t0 lasting dur+rel"""
    n0 = int(t0 * SR)
    n1 = min(N, int((t0 + dur + rel + 0.05) * SR))
    if n0 >= N: return None, None, None
    tt = np.arange(n0, n1) / SR - t0
    e = np.zeros_like(tt)
    a = tt < att
    e[a] = tt[a] / att
    b = ~a
    # exponential decay after attack
    e[b] = np.exp(-(tt[b] - att) / max(dur, 1e-3) * 4.0)
    e *= peak
    return n0, n1, e

def note(f, t0, dur, peak=0.1, kind='pluck', pan=0.0, bright=2400):
    r = adsr_env(t0, dur, att=0.005 if kind == 'pluck' else 0.3, rel=0.35 if kind == 'pluck' else 0.5, peak=peak)
    if r[0] is None: return
    n0, n1, e = r
    tt = np.arange(n0, n1) / SR
    if kind == 'pluck':
        # soft mallet: triangle + gentle 2nd harmonic, lowpassed by simple smoothing
        x = np.sin(2 * np.pi * f * tt) + 0.35 * np.sin(2 * np.pi * f * 2.0 * tt)
        x *= 0.8
    else:
        x = np.sin(2 * np.pi * f * tt) + 0.15 * np.sin(2 * np.pi * f * 2.001 * tt)
    seg = x * e
    mix[n0:n1] += seg * (1.0 - 0.25 * pan)
    # store pan info separately via a second pass list
    pans.append((n0, n1, seg, pan))

pans = []
def pad(freqs, t0, t1, peak=0.035):
    n0 = int(t0 * SR); n1 = min(N, int(t1 * SR))
    if n0 >= N: return
    tt = np.arange(n0, n1) / SR
    att = min(0.6, (t1 - t0) / 3)
    rel = min(0.9, (t1 - t0) / 2.5)
    e = np.minimum(tt - t0, 0) * 0  # zeros
    e = np.clip((tt - t0) / att, 0, 1) * np.clip((t1 - tt) / rel, 0, 1)
    e = np.minimum(e, 1.0)
    x = np.zeros_like(tt)
    for f in freqs:
        x += np.sin(2 * np.pi * f * tt) + 0.12 * np.sin(2 * np.pi * f * 2.003 * tt)
    x /= len(freqs)
    mix[n0:n1] += x * e * peak

def rustle(t0, dur=0.35, peak=0.012):
    n0 = int(t0 * SR); n1 = min(N, int((t0 + dur) * SR))
    if n0 >= N: return
    tt = np.arange(n0, n1) / SR - t0
    rng = np.random.default_rng(7)
    x = rng.standard_normal(n1 - n0)
    # one-pole lowpass ~ soft paper
    a = 0.18
    y = np.zeros_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += a * (x[i] - acc)
        y[i] = acc
    e = np.sin(np.pi * np.clip(tt / dur, 0, 1)) ** 2
    mix[n0:n1] += y * e * peak

def chime(f, t0, peak=0.05, dur=0.9):
    r = adsr_env(t0, dur, att=0.004, rel=0.6, peak=peak)
    if r[0] is None: return
    n0, n1, e = r
    tt = np.arange(n0, n1) / SR
    x = np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(2 * np.pi * f * 3.01 * tt)
    mix[n0:n1] += x * e

# ---------- SCORE ----------
# Act 1 Seed: soft G pad; motif as the seed lands (plant 1.0)
pad([196.0, 293.66, 493.88], 0.0, 4.1, 0.05)          # G3 D4 B4
note(392.0, 1.0, 0.5, 0.09)                            # G4
note(587.33, 1.25, 0.7, 0.08)                          # D5 (rising fifth)
rustle(3.7, 0.35)                                      # paper swish into morph

# Act 2 Rain: C pad, a few soft raindrops only; motif a third up at sprout (5.5)
pad([130.81, 196.0, 329.63], 4.0, 8.05, 0.055)         # C3 G3 E4
for i, dt in enumerate([0.0, 0.75, 1.5, 2.25]):
    note([1046.5, 1318.5, 1568.0, 1760.0][i], 4.5 + dt, 0.18, 0.028)
note(329.63, 5.5, 0.5, 0.08)                           # E4
note(493.88, 5.75, 0.5, 0.07)                          # B4
note(659.25, 6.0, 0.8, 0.06)                           # E5
rustle(7.7, 0.35)

# Act 3 Tree: fullest pad + soft bass, two blossom chimes (8.5 birds skipped, 9.5 blossoms)
pad([130.81, 196.0, 261.63, 329.63], 8.0, 11.55, 0.06) # C3 G3 C4 E4
for i in range(3):
    note(65.41, 8.0 + i * 1.0, 0.9, 0.05, kind='pad')  # C2 soft bass
chime(1318.5, 9.5, 0.03)
chime(1568.0, 9.8, 0.025)
note(880.0, 10.5, 0.6, 0.055)                          # fruit A5
rustle(11.7, 0.3, 0.010)

# Act 4 Hush 11.5-12.0: nothing

# Act 5 Again: warm chord accent at 12.0, then F pad; motif returns slower; leaf chime 13.2
note(261.63, 12.0, 0.5, 0.07)                          # C4
note(329.63, 12.0, 0.5, 0.06)                          # E4
note(392.0, 12.0, 0.6, 0.06)                           # G4
note(65.41, 12.0, 1.1, 0.045, kind='pad')              # soft sub C2
pad([174.61, 261.63, 349.23, 440.0], 12.35, 15.9, 0.055)  # F3 C4 F4 A4, fades by 15.9
chime(659.25, 13.2, 0.035, 1.2)                        # leaf E5, gentle
note(392.0, 13.6, 0.5, 0.06)                           # motif returns, slower
note(587.33, 14.1, 0.6, 0.055)
note(784.0, 14.6, 1.0, 0.05)                           # G5, rings into the pad

# ---------- MASTER ----------
# gentle soft-clip / normalize to -1.5 dBFS peak, then 1s end fade so it never cuts
mix = np.tanh(mix * 1.2)
peak = np.max(np.abs(mix))
mix *= 0.84 / max(peak, 1e-9)
fade = int(1.0 * SR)
mix[-fade:] *= np.linspace(1, 0, fade) ** 1.5

# stereo: slight width via tiny haas delay on right
d = int(0.006 * SR)
right = np.concatenate([np.zeros(d), mix[:-d]]) * 0.96
left = mix
stereo = np.stack([left, right], axis=1)
stereo = np.clip(stereo, -1, 1)
pcm = (stereo * 32767).astype(np.int16)

parser = argparse.ArgumentParser(description='Generate the Grow demo score WAV.')
parser.add_argument('--output', type=Path, default=Path(__file__).with_name('grow-score-v2.wav'))
output = parser.parse_args().output
output.parent.mkdir(parents=True, exist_ok=True)
w = wave.open(str(output), 'wb')
w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes(pcm.tobytes())
w.close()
print('wrote', output, pcm.shape)
