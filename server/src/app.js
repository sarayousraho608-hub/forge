import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import skills from './routes/skills.js';
import projects from './routes/projects.js';
import messages from './routes/messages.js';
import settings from './routes/settings.js';
import claims from './routes/claims.js';
import chat from './routes/chat.js';
import secrets from './routes/secrets.js';
import admin from './routes/admin.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();
  app.set('trust proxy', 1); // خلف Render: لنقرأ عنوان IP الحقيقي

  const allowed = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',').map((s) => s.trim()).filter(Boolean);

  app.use(helmet());
  app.use(cors({
    origin: (origin, cb) => cb(null, !origin || allowed.includes(origin)),
    exposedHeaders: ['X-Cache'], // ليقرأها المتصفح
  }));
  app.use(express.json({ limit: '10kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, db: mongoose.connection.readyState === 1 ? 'connected' : 'down' });
  });
  app.use('/api/skills', skills);
  app.use('/api/projects', projects);
  app.use('/api/messages', messages);
  app.use('/api/settings', settings);
  app.use('/api/claims', claims);
  app.use('/api/chat', chat);
  app.use('/api/secrets', secrets);
  app.use('/api/admin', admin);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
