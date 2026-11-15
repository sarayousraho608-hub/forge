import { Router } from 'express';
import adminAuth from '../middleware/adminAuth.js';
import Claim from '../models/Claim.js';
import Message from '../models/Message.js';
import PrizeCode from '../models/PrizeCode.js';
import Setting from '../models/Setting.js';
import { clearCache } from '../middleware/cache.js';

const router = Router();
router.use(adminAuth);

// ملخص سريع
router.get('/summary', async (_req, res) => {
  const [accepted, rejected, remaining, messages] = await Promise.all([
    Claim.countDocuments({ status: 'accepted' }),
    Claim.countDocuments({ status: 'rejected' }),
    PrizeCode.countDocuments({ claimedBy: null }),
    Message.countDocuments(),
  ]);
  res.json({ accepted, rejected, remaining, messages });
});

// الطلبات: ?status=accepted أو rejected
router.get('/claims', async (req, res) => {
  const filter = ['accepted', 'rejected'].includes(req.query.status) ? { status: req.query.status } : {};
  res.json(await Claim.find(filter).sort({ createdAt: -1 }).limit(500));
});

router.get('/messages', async (_req, res) => {
  res.json(await Message.find().sort({ createdAt: -1 }).limit(200));
});

// تغيير الإتاحة: { "available": false }
router.put('/settings', async (req, res) => {
  if (typeof req.body?.available !== 'boolean') return res.status(400).json({ error: 'available must be boolean' });
  await Setting.findOneAndUpdate({ key: 'available' }, { value: req.body.available }, { upsert: true });
  clearCache('/api/settings');
  res.json({ available: req.body.available });
});

// مسح كل الكاش (بعد تعديل المحتوى يدوياً في القاعدة)
router.post('/cache/clear', (_req, res) => {
  clearCache();
  res.json({ ok: true });
});

export default router;
