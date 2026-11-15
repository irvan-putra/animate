# Grow soundtrack

The video in `../../../docs/grow.mp4` uses this synthesized 16-second score.

To regenerate the WAV with Python 3 and NumPy:

```sh
python3 -m pip install numpy
python3 generate_score.py
```

The default output is `grow-score-v2.wav`; use `--output PATH` to choose another location. The score is embedded in the MP4 as AAC audio. The generation script reproduces the supplied PCM WAV byte-for-byte.
