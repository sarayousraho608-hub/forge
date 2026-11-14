import { Router } from 'express';
import Project from '../models/Project.js';

const router = Router();
router.get('/', async (_req, res) => {
  res.json(await Project.find().sort({ order: 1 }));
});
export default router;
