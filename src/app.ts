import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import getRoutes from '@lib/startup/getRoutes';
import checkInitializeProjectSettings from '@lib/startup/checkInitializeProjectSettings';
import error from '@error';
import { defaultMessage, defaultCode } from '@lib/httpCode';
import { debugLogger } from '@lib/logger';

interface MiddlewareError {
  status?: number;
  message?: string;
  code?: string;
  data?: Record<string, any>;
  expose?: boolean;
}

const app = express();

checkInitializeProjectSettings();

// Security settings
app.use(helmet());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'development'
        ? '*'
        : process.env.REQUEST_URI || '*',
  }),
);

// Parser
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Public files
app.use(express.static('public'));

getRoutes().forEach((data) => {
  app.use(data.path || '/', data.router);
});

// 404
app.use((req) => {
  error.PageNotFound(req.url);
});

// Error handler
app.use(
  (error: MiddlewareError, req: Request, res: Response, next: NextFunction) => {
    const status = error.status || 500;
    const message =
      error.message && error.expose ? error.message : defaultMessage(status);
    const code = error.code || defaultCode(status);
    const data = error.data || {};

    if (!error.expose) {
      debugLogger(error, false);
    }

    res.status(status).json({
      status,
      message,
      code,
      ...data,
    });
    next();
  },
);

export default app;
