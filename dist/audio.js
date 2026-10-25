// Original synthesized pentatonic motif; no downloads or copyrighted recordings.
export class Sound {
  constructor() {
    this.ctx = null;
    this.beat = 0;
    this.elapsed = 0;
  }
  unlock() {
    try {
      this.ctx ??= new (window.AudioContext || window.webkitAudioContext)();
      this.ctx.resume();
    } catch {}
  }
  note(freq, length, volume, type = "square") {
    if (!this.ctx || this.ctx.state !== "running" || volume <= 0) return;
    const o = this.ctx.createOscillator(),
      g = this.ctx.createGain(),
      t = this.ctx.currentTime;
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(volume * 0.09, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + length);
    o.connect(g);
    g.connect(this.ctx.destination);
    o.start(t);
    o.stop(t + length);
  }
  effect(kind, settings) {
    if (settings.mute) return;
    const seq =
      kind === "win"
        ? [523, 659, 784, 1046]
        : kind === "error"
          ? [196, 147]
          : kind === "step"
            ? [130]
            : [523, 784];
    seq.forEach((f, i) =>
      setTimeout(() => this.note(f, 0.12, settings.sound, "triangle"), i * 75),
    );
  }
  update(dt, level, settings, playing) {
    if (settings.mute || !playing) return;
    this.elapsed += dt;
    const interval = level === 3 ? 0.22 : level === 2 ? 0.48 : 0.38;
    if (this.elapsed < interval) return;
    this.elapsed = 0;
    const notes =
      level === 2
        ? [146, 0, 174, 0, 130, 0, 164, 0]
        : [261, 329, 392, 440, 392, 329, 293, 196];
    const n = notes[this.beat++ % notes.length];
    if (n) this.note(n, interval * 0.7, settings.music, "triangle");
  }
}
