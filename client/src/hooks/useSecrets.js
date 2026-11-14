import { useSyncExternalStore } from 'react';
import { playSecret } from '../sound';

// الأسرار الثلاثة. الحالة محفوظة في المتصفح (لاحقاً سنؤكدها من الخادم).
export const SECRET_IDS = ['sunglasses', 'nothing', 'console'];
const KEY = 'forge_secrets';

function load() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(v) ? v.filter((x) => SECRET_IDS.includes(x)) : [];
  } catch {
    return [];
  }
}

let state = { found: load(), popup: null };
const listeners = new Set();
function set(next) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

export function unlockSecret(id) {
  if (!SECRET_IDS.includes(id)) return;
  const again = state.found.includes(id);
  let found = state.found;
  if (!again) {
    found = [...found, id];
    try { localStorage.setItem(KEY, JSON.stringify(found)); } catch { /* تجاهل */ }
  }
  playSecret();
  set({ found, popup: { id, again } });
}

export function closePopup() { set({ popup: null }); }

// السر الثالث: يكتبه الفضولي في الـ Console. (أداة اختبار: resetSecrets())
if (typeof window !== 'undefined') {
  window.unlockSecret3 = () => { unlockSecret('console'); return '🎉'; };
  window.resetSecrets = () => {
    try { localStorage.removeItem(KEY); } catch { /* تجاهل */ }
    set({ found: [], popup: null });
  };
}

export default function useSecrets() {
  const s = useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => state,
  );
  return { found: s.found, popup: s.popup, count: s.found.length, total: SECRET_IDS.length };
}
