import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import getRoutes from './lib/startup/getRoutes';
import Error from '@src/error/index';
import checkInitializeProjectSettings from './lib/startup/checkInitializeProjectSettings';

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

app.use(express.static('public'));

getRoutes().forEach((data) => {
  app.use(data.path || '/', data.router);
});

// 404
app.use((req) => {
  Error.PageNotFound(req.url);
});

// Error handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const status = error.status || 500;
  const message =
    error.message && error.expose
      ? error.message
      : 'Unknown Error has occured.';
  const code = error.code || 'UNKNOWN_ERROR';
  const data = error.data || {};
  if (!error.expose || process.env.NODE_ENV === 'development') {
    console.error(error);
  }

  res.status(status).json({
    status,
    message,
    code,
    ...data,
  });
  next();
});

export default app;
