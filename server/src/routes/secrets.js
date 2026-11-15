import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import SecretProof from '../models/SecretProof.js';

const router = Router();
const limiter = rateLimit({ windowMs: 10 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false });
const VID_RE = /^[a-zA-Z0-9-]{16,64}$/;

// تسجيل كشف السر الأول أو الثاني (السر الثالث يُسجَّل فقط عبر المساعد)
router.post('/', limiter, async (req, res) => {
  const visitorId = String(req.body?.visitorId || '');
  const secret = String(req.body?.secret || '');
  if (!VID_RE.test(visitorId) || !['sunglasses', 'nothing'].includes(secret)) {
    return res.status(400).json({ error: 'bad_request' });
  }
  await SecretProof.updateOne({ visitorId, secret }, { $setOnInsert: { visitorId, secret } }, { upsert: true });
  res.json({ ok: true });
});

export default router;
