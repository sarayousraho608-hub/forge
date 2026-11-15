import { Router } from 'express';
import Project from '../models/Project.js';
import { cache } from '../middleware/cache.js';

const router = Router();
router.get('/', cache(60), async (_req, res) => {
  res.json(await Project.find().sort({ order: 1 }));
});
export default router;
