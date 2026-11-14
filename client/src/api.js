// وضع المشروع 1: واجهة فقط (تقرأ من public/data/*.json)
// وضع المشروع 2: مع الخادم — يُفعَّل بمتغيّر البيئة VITE_USE_API=true
export const USE_API = import.meta.env.VITE_USE_API === 'true';
const BASE = import.meta.env.VITE_API_URL || ''; // فارغ محلياً (نستعمل proxy)، وعند النشر رابط Render

export const apiUrl = (path) => BASE + path;
export const dataUrl = (name) => (USE_API ? apiUrl(`/api/${name}`) : `/data/${name}.json`);

export async function postJson(path, body) {
  const res = await fetch(apiUrl(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  let data = null;
  try { data = await res.json(); } catch { /* لا جسم */ }
  return { ok: res.ok, status: res.status, data };
}
