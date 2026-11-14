// أصوات مولَّدة بالكود (WebAudio) — لا حاجة لأي ملف صوتي ولا إنترنت.
let ctx = null;
let lastHover = 0;
let muted = false;
try { muted = localStorage.getItem('muted') === '1'; } catch { /* تجاهل */ }

export const isMuted = () => muted;
export function toggleMuted() {
  muted = !muted;
  try { localStorage.setItem('muted', muted ? '1' : '0'); } catch { /* تجاهل */ }
  return muted;
}

function audio() {
  // المتصفح يمنع الصوت قبل أول تفاعل من المستخدم
  if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, dur, { type = 'sine', gain = 0.05, delay = 0, to } = {}) {
  if (muted) return;
  const c = audio();
  if (!c) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

export function playHover() {
  const now = performance.now();
  if (now - lastHover < 70) return;
  lastHover = now;
  tone(900, 0.05, { gain: 0.025 });
}
export function playClick() { tone(420, 0.09, { type: 'triangle', gain: 0.06, to: 260 }); }
export function playSend() { tone(500, 0.08, { type: 'triangle', gain: 0.05 }); tone(750, 0.1, { type: 'triangle', gain: 0.05, delay: 0.07 }); }
export function playReply() { tone(880, 0.12, { gain: 0.05 }); tone(1180, 0.18, { gain: 0.05, delay: 0.1 }); }
export function playSecret() {
  [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, { type: 'triangle', gain: 0.07, delay: i * 0.11 }));
}
