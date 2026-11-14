import { useSyncExternalStore } from 'react';
import { playSecret } from '../sound';

// الأسرار الثلاثة. الحالة محفوظة في المتصفح (لاحقاً سنؤكدها من الخادم).
export const SECRET_IDS = ['sunglasses', 'nothing', 'ai'];
const KEY = 'forge_secrets';
const SEEN_KEY = 'forge_secrets_seen';

function load(key) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return Array.isArray(v) ? v.filter((x) => SECRET_IDS.includes(x)) : [];
  } catch {
    return [];
  }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* تجاهل */ }
}

let state = { found: load(KEY), seen: load(SEEN_KEY), popup: null };
const listeners = new Set();
function set(next) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

// يظهر التهنئة مرة واحدة فقط (أول مرة). المرات التالية صامتة.
export function unlockSecret(id) {
  if (!SECRET_IDS.includes(id) || state.found.includes(id)) return;
  const found = [...state.found, id];
  save(KEY, found);
  playSecret();
  set({ found, popup: { id } });
}

export function closePopup() { set({ popup: null }); }

// عند زيارة صفحة الجائزة تُعتبر الأسرار "مرئية" فيختفي الإشعار
export function markSeen() {
  if (state.seen.length === state.found.length) return;
  save(SEEN_KEY, state.found);
  set({ seen: state.found });
}

// أداة اختبار في الـ Console: resetSecrets()
if (typeof window !== 'undefined') {
  window.resetSecrets = () => {
    try { localStorage.removeItem(KEY); localStorage.removeItem(SEEN_KEY); } catch { /* تجاهل */ }
    set({ found: [], seen: [], popup: null });
  };
}

export default function useSecrets() {
  const s = useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => state,
  );
  return {
    found: s.found,
    popup: s.popup,
    count: s.found.length,
    total: SECRET_IDS.length,
    unseen: s.found.filter((x) => !s.seen.includes(x)).length,
  };
}
