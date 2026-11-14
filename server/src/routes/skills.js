import { Router } from 'express';
import Skill from '../models/Skill.js';

const router = Router();
router.get('/', async (_req, res) => {
  res.json(await Skill.find().sort({ order: 1 }));
});
export default router;
