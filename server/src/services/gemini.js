// اتصال مباشر بـ Gemini عبر fetch (لا مكتبات). المفتاح يبقى في الخادم فقط.
const MODELS = [...new Set([process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite', 'gemini-flash-lite-latest'])];

export async function askGemini({ system, contents }) {
  const key = process.env.GEMINI_KEY;
  if (!key) throw new Error('GEMINI_KEY is missing');

  let lastErr;
  for (const model of MODELS) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents,
          generationConfig: { maxOutputTokens: 500, temperature: 0.6 },
        }),
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) throw new Error(`Gemini ${model} responded ${res.status}`);
      const data = await res.json();
      const text = (data.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('').trim();
      if (!text) throw new Error('Gemini returned empty text');
      return text;
    } catch (err) {
      lastErr = err; // نجرّب النموذج التالي
    }
  }
  throw lastErr;
}
