"""
Synthesises an original 60-second Indian wedding track (no samples, no copyrighted music):
tanpura drone, santoor (hammered dulcimer), bansuri (flute), dholak and temple bells.

Structure (96 BPM, 2.5 s per bar):
  0-10 s   devotional opening for Ganesh Ji: drone, bells, slow santoor alaap
  10-50 s  dholak keherwa groove + bansuri melody + santoor ripples
  50-60 s  resolution on Sa, bells, fade
Usage: python3 tools/make_music.py assets/music.mp3
"""
import sys, subprocess, tempfile, os
import numpy as np
from scipy.signal import fftconvolve, butter, sosfilt

SR = 44100
DUR = 60.0
BPM = 96
BEAT = 60 / BPM
BAR = 4 * BEAT
N = int(SR * (DUR + 3))
rng = np.random.default_rng(7)

SA = 146.83  # D3

def hz(semi, octave=0):
    return SA * 2 ** ((semi + 12 * octave) / 12)

L = np.zeros(N); R = np.zeros(N)

def add(sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N: return
    sig = sig[: N - i] * gain
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    L[i:i + len(sig)] += sig * l
    R[i:i + len(sig)] += sig * r

def env_adsr(n, a=0.01, d=0.1, s=0.7, r=0.2):
    e = np.ones(n) * s
    na, nd, nr = int(a * SR), int(d * SR), int(r * SR)
    na = max(na, 1)
    e[:na] = np.linspace(0, 1, na)
    e[na:na + nd] = np.linspace(1, s, len(e[na:na + nd]))
    if nr > 0: e[-nr:] *= np.linspace(1, 0, nr)
    return e

# ---------- Karplus-Strong (vectorised per period) ----------
def pluck(f, dur, bright=0.5, decay=0.996):
    n = int(dur * SR)
    p = int(SR / f)
    buf = rng.uniform(-1, 1, p)
    # soften the excitation for a less harsh attack
    buf = np.convolve(buf, np.ones(3) / 3, mode="same") * (0.6 + bright)
    out = np.zeros(n + p)
    out[:p] = buf
    i = p
    while i < n:
        prev = out[i - p:i]
        nxt = np.empty_like(prev)
        nxt[1:] = 0.5 * (prev[1:] + prev[:-1])
        nxt[0] = 0.5 * (prev[0] + out[i - 1])
        nxt *= decay
        m = min(p, n + p - i)
        out[i:i + m] = nxt[:m]
        i += p
    out = out[:n]
    out *= np.linspace(1, 0, n) ** 0.3
    return out

def santoor(f, dur=1.6, vel=1.0):
    # hammered: two quick strikes, slightly detuned course of strings
    a = pluck(f, dur, 0.7, 0.9965) + 0.7 * pluck(f * 1.003, dur, 0.7, 0.9965)
    return a * 0.35 * vel

# ---------- Bansuri ----------
def bansuri(f, dur, vel=1.0):
    n = int(dur * SR); t = np.arange(n) / SR
    vib = 1 + 0.006 * np.sin(2 * np.pi * 5.2 * t) * np.clip(t / 0.35, 0, 1)
    ph = 2 * np.pi * np.cumsum(f * vib) / SR
    tone = np.sin(ph) + 0.18 * np.sin(2 * ph) + 0.06 * np.sin(3 * ph)
    sos = butter(2, [f * 0.8, f * 3], btype="band", fs=SR, output="sos")
    breath = sosfilt(sos, rng.normal(0, 1, n)) * 0.12
    e = env_adsr(n, a=0.06, d=0.15, s=0.85, r=min(0.25, dur * 0.4))
    return (tone + breath) * e * 0.28 * vel

# ---------- Tanpura ----------
def tanpura(f, dur=3.2):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.zeros(n)
    for k in range(1, 16):
        amp = (1 / k) * (1 + 0.6 * np.sin(2 * np.pi * (0.35 + 0.07 * k) * t + k))  # jawari shimmer
        s += amp * np.sin(2 * np.pi * f * k * (1 + 0.0007 * k) * t)
    e = np.exp(-t / 2.2) * np.clip(t / 0.02, 0, 1)
    return s * e * 0.03

# ---------- Temple bell ----------
def bell(f=880, dur=4.0):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.zeros(n)
    for ratio, amp, dec in [(1, 1, 2.2), (2.0, .5, 1.6), (2.76, .45, 1.2), (5.4, .25, .7), (8.93, .15, .4)]:
        s += amp * np.sin(2 * np.pi * f * ratio * t) * np.exp(-t / dec)
    return s * np.clip(t / 0.003, 0, 1) * 0.12

# ---------- Dholak ----------
def dha(vel=1.0):
    n = int(0.45 * SR); t = np.arange(n) / SR
    f = 70 + 75 * np.exp(-t / 0.035)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.16)
    s += rng.normal(0, 1, n) * np.exp(-t / 0.01) * 0.15
    return s * 0.45 * vel

def na(vel=1.0):
    n = int(0.25 * SR); t = np.arange(n) / SR
    sos = butter(2, [1800, 5200], btype="band", fs=SR, output="sos")
    s = sosfilt(sos, rng.normal(0, 1, n)) * np.exp(-t / 0.035) * 0.9
    s += np.sin(2 * np.pi * 620 * t) * np.exp(-t / 0.06) * 0.35
    return s * 0.35 * vel

def ka(vel=1.0):
    n = int(0.08 * SR); t = np.arange(n) / SR
    sos = butter(2, 3000, btype="high", fs=SR, output="sos")
    return sosfilt(sos, rng.normal(0, 1, n)) * np.exp(-t / 0.012) * 0.25 * vel

def bass(f, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t)
    return s * env_adsr(n, 0.01, 0.2, 0.6, 0.3) * 0.14

# =============== Arrangement ===============
# Tanpura drone throughout (Pa Sa' Sa' Sa cycle)
t = 0.0
cycle = [hz(7, -1), hz(0), hz(0), hz(0, -1)]
k = 0
while t < DUR - 1:
    add(tanpura(cycle[k % 4]), t, 1.0, [-0.3, 0.1, 0.2, -0.1][k % 4])
    t += 0.6; k += 1

# Temple bells
for tb, f in [(0.0, 1046), (0.15, 1318), (4.8, 1046), (9.6, 880), (50.0, 1046), (55.0, 880), (57.5, 1046)]:
    add(bell(f), tb, 1.0, 0.4 if f > 1000 else -0.4)

# Intro alaap on santoor (0-10 s)
alaap = [(0.6, 0), (1.3, 4), (1.9, 7), (2.6, 9), (3.4, 12), (4.4, 9), (5.0, 7), (5.6, 4),
         (6.3, 7), (6.9, 9), (7.4, 12), (7.9, 14), (8.5, 16), (9.2, 12)]
for tt, s in alaap:
    add(santoor(hz(s, 1), 2.5), tt, 0.9, rng.uniform(-0.4, 0.4))

# Groove section: bars 4..19 (10 s - 50 s)
G0, G1 = 4, 20
keherwa = [("dha", 0), ("ka", 0.5), ("na", 1), ("dha", 1.5), ("na", 2), ("ka", 2.5), ("dha", 3), ("na", 3.5)]
for b in range(G0, G1 + 1):
    t0 = b * BAR
    last = (b == G1)
    for stroke, pos in keherwa:
        if last and pos > 1: break
        tt = t0 + pos * BEAT + rng.normal(0, 0.004)
        v = rng.uniform(0.85, 1.0)
        if stroke == "dha": add(dha(v), tt, 1.0, -0.1); add(na(v * 0.5), tt, 1.0, 0.15)
        elif stroke == "na": add(na(v), tt, 1.0, 0.15)
        else: add(ka(v), tt, 1.0, 0.25)
    root = 0 if (b % 2 == 0) else 7
    add(bass(hz(root, -1), BAR * 0.95), t0, 1.0)
    # santoor ripple accompaniment (eighth notes)
    ripple = [0, 7, 12, 16, 12, 7, 12, 19] if root == 0 else [7, 11, 14, 19, 14, 11, 14, 19]
    ripple = [0, 7, 12, 16, 12, 7, 12, 19] if root == 0 else [-5, 2, 7, 11, 7, 2, 7, 14]
    for j, s in enumerate(ripple):
        if last and j > 3: break
        add(santoor(hz(s), 1.2, 0.55), t0 + j * BEAT / 2, 1.0, 0.45 if j % 2 else -0.45)

# Bansuri melody over bars 5..20 (12.5 s - 52.5 s) -> phrase set played twice
A1 = [(4,1),(7,1),(9,1),(7,.5),(9,.5),(12,1.5),(9,.5),(7,2)]
A2 = [(9,1),(7,1),(4,1),(7,.5),(4,.5),(2,1.5),(4,.5),(0,2)]
B1 = [(12,1),(14,1),(12,.5),(9,.5),(7,1),(9,1.5),(12,.5),(9,1),(7,1)]
B2 = [(4,1),(7,1),(9,1),(7,1),(4,1),(2,1),(0,2)]
mel = (A1 + A2 + B1 + B2) * 2
tt = 5 * BAR
for s, d in mel:
    add(bansuri(hz(s, 1), d * BEAT * 1.02), tt, 1.0, 0.05)
    tt += d * BEAT
# Final long Sa' on bansuri + closing santoor cascade
add(bansuri(hz(12, 1), 5.5), 50.0, 1.0, 0.05)
for j, s in enumerate([24, 21, 19, 16, 14, 12, 9, 7, 4, 2, 0]):
    add(santoor(hz(s), 2.8, 0.8), 50.4 + j * 0.32, 1.0, -0.5 + j * 0.1)
add(santoor(hz(0), 4.0, 0.9), 54.6, 1.0); add(santoor(hz(7), 4.0, 0.7), 54.6, 1.0)
add(bass(hz(0, -1), 4.0), 50.0, 1.0)

# =============== Mix / reverb / master ===============
ir_n = int(2.2 * SR); ti = np.arange(ir_n) / SR
irL = rng.normal(0, 1, ir_n) * np.exp(-ti / 0.55); irR = rng.normal(0, 1, ir_n) * np.exp(-ti / 0.55)
irL[0] = irR[0] = 0
wetL = fftconvolve(L, irL)[:N] * 0.018
wetR = fftconvolve(R, irR)[:N] * 0.018
outL, outR = L + wetL, R + wetR
hp = butter(2, 60, btype='high', fs=SR, output='sos')
outL, outR = sosfilt(hp, outL), sosfilt(hp, outR)
st = np.stack([outL, outR], 1)[: int(DUR * SR)]
fade = int(3.5 * SR)
st[-fade:] *= np.linspace(1, 0, fade)[:, None] ** 1.5
st[: int(0.02 * SR)] *= np.linspace(0, 1, int(0.02 * SR))[:, None]
st = np.tanh(st / np.max(np.abs(st)) * 1.4) / np.tanh(1.4) * 0.89

out = sys.argv[1] if len(sys.argv) > 1 else "music.mp3"
with tempfile.TemporaryDirectory() as d:
    wav = os.path.join(d, "m.wav")
    import wave
    with wave.open(wav, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype("<i2").tobytes())
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", wav, "-c:a", "libmp3lame", "-b:a", "160k", out], check=True)
print("wrote", out)
