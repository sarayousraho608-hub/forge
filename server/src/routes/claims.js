import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import Claim from '../models/Claim.js';
import PrizeCode from '../models/PrizeCode.js';

const router = Router();
const limiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });
const EMAIL_RE = /^\S+@\S+\.\S+$/;
const REQUIRED_SECRETS = ['sunglasses', 'nothing', 'ai'];

// توحيد البريد: أحرف صغيرة، وفي gmail نحذف النقاط وما بعد +
function emailKey(email) {
  const [local, domain] = email.split('@');
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    return local.split('+')[0].replace(/\./g, '') + '@gmail.com';
  }
  return email;
}

// كم كوداً بقي؟
router.get('/status', async (_req, res) => {
  const limit = await PrizeCode.countDocuments();
  const remaining = await PrizeCode.countDocuments({ claimedBy: null });
  res.json({ limit, remaining });
});

router.post('/', limiter, async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const secrets = Array.isArray(req.body?.secrets) ? req.body.secrets : [];
  if (!EMAIL_RE.test(email) || email.length > 120) {
    return res.status(400).json({ status: 'error', reason: 'invalid_email' });
  }
  const key = emailKey(email);
  const base = { email, emailKey: key, ip: req.ip, userAgent: (req.get('user-agent') || '').slice(0, 200) };
  const reject = async (reason) => {
    await Claim.create({ ...base, status: 'rejected', reason });
    return res.json({ status: 'rejected', reason });
  };

  // 1) الأسرار الثلاثة (ملاحظة: يوم الرابع نجعل الخادم يتحقق من السر الثالث بنفسه)
  if (!REQUIRED_SECRETS.every((s) => secrets.includes(s))) return reject('secrets_incomplete');

  // 2) هذا البريد أخذ كوداً من قبل؟
  if (await Claim.exists({ emailKey: key, status: 'accepted' })) return reject('already_claimed');

  // 3) خذ كوداً حرّاً (عملية واحدة ذرّية: لا يأخذ كودين شخصان معاً)
  const prize = await PrizeCode.findOneAndUpdate(
    { claimedBy: null },
    { claimedBy: email, claimedAt: new Date() },
    { new: true },
  );
  if (!prize) return reject('sold_out');

  try {
    await Claim.create({ ...base, status: 'accepted', code: prize.code });
    return res.status(201).json({ status: 'accepted', code: prize.code });
  } catch (err) {
    if (err.code === 11000) {
      // طلبان متزامنان لنفس البريد: نُرجع الكود إلى المخزن
      await PrizeCode.updateOne({ _id: prize._id }, { claimedBy: null, claimedAt: null });
      return reject('already_claimed');
    }
    throw err;
  }
});

export default router;
