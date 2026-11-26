import dotenv from 'dotenv';
dotenv.config({ path: new URL('.env', import.meta.url) });
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import apiRoutes from './routes/api.js';
import { connectDatabase } from './config/database.js';
import { notFound, errorHandler } from './middleware/error.js';
import { issueCsrf, verifyCsrf } from './middleware/csrf.js';

export function createApp() {
  const app = express();
  app.set('trust proxy', 1);
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cors({
    origin(origin, cb) {
      const configured = (process.env.CLIENT_URL || 'http://localhost:5173')
        .split(',')
        .map(value => value.trim())
        .filter(Boolean);
      const vercelOrigins = [process.env.VERCEL_PROJECT_PRODUCTION_URL, process.env.VERCEL_URL]
        .filter(Boolean)
        .map(host => `https://${host}`);
      const allowed = [...configured, ...vercelOrigins];
      if (!origin || allowed.includes(origin)) cb(null, true);
      else cb(new Error('Origin not allowed'));
    },
    credentials: true
  }));
  app.use(express.json({ limit: '16kb' }));
  app.use(cookieParser());
  app.use(issueCsrf);
  if (process.env.NODE_ENV !== 'test') app.use(verifyCsrf);
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false }));
  app.get('/api/health', (_req, res) => res.json({ success: true, status: 'ok' }));
  app.use('/api', apiRoutes);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}

if (process.argv[1]?.endsWith('server.js')) {
  connectDatabase().then(() => { const app = createApp(); app.listen(process.env.PORT || 5000, () => console.log(`SecureAuth server running on port ${process.env.PORT || 5000}`)); }).catch(error => { console.error(error.message); process.exit(1); });
}
