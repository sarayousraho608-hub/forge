// معرّف عشوائي للزائر (محفوظ في المتصفح) يربط أسراره بطلب الكود. ليس بيانات شخصية.
const KEY = 'forge_vid';

export function getVisitorId() {
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return 'anonymous-' + Math.random().toString(36).slice(2, 12).padEnd(10, '0');
  }
}

export function resetVisitorId() {
  try { localStorage.removeItem(KEY); } catch { /* تجاهل */ }
}
