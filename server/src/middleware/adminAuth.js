import { timingSafeEqual } from 'node:crypto';

// حماية صفحات المشرفة: الترويسة x-admin-key يجب أن تساوي ADMIN_KEY
export default function adminAuth(req, res, next) {
  const key = process.env.ADMIN_KEY;
  if (!key) return res.status(503).json({ error: 'admin_disabled' });
  const sent = Buffer.from(String(req.get('x-admin-key') || ''));
  const real = Buffer.from(key);
  if (sent.length !== real.length || !timingSafeEqual(sent, real)) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  next();
}
