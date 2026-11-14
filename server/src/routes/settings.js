import { Router } from 'express';
import Setting from '../models/Setting.js';

const router = Router();
router.get('/', async (_req, res) => {
  const row = await Setting.findOne({ key: 'available' });
  res.json({ available: row ? Boolean(row.value) : true });
});
export default router;
