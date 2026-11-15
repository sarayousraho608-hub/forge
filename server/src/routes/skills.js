import { Router } from 'express';
import Skill from '../models/Skill.js';
import { cache } from '../middleware/cache.js';

const router = Router();
router.get('/', cache(60), async (_req, res) => {
  res.json(await Skill.find().sort({ order: 1 }));
});
export default router;
