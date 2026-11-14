import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import Message from '../models/Message.js';

const router = Router();
const limiter = rateLimit({ windowMs: 10 * 60 * 1000, limit: 5, standardHeaders: true, legacyHeaders: false });
const EMAIL_RE = /^\S+@\S+\.\S+$/;

router.post('/', limiter, async (req, res) => {
  const name = String(req.body?.name || '').trim();
  const email = String(req.body?.email || '').trim();
  const message = String(req.body?.message || '').trim();

  const errors = {};
  if (!name || name.length > 80) errors.name = 'invalid';
  if (!EMAIL_RE.test(email) || email.length > 120) errors.email = 'invalid';
  if (message.length < 10 || message.length > 2000) errors.message = 'invalid';
  if (Object.keys(errors).length) return res.status(400).json({ error: 'validation', fields: errors });

  await Message.create({ name, email, message, ip: req.ip });
  res.status(201).json({ ok: true });
});
export default router;
