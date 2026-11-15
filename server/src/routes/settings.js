import { Router } from 'express';
import Setting from '../models/Setting.js';
import { cache } from '../middleware/cache.js';

const router = Router();
router.get('/', cache(15), async (_req, res) => {
  const row = await Setting.findOne({ key: 'available' });
  res.json({ available: row ? Boolean(row.value) : true });
});
export default router;
