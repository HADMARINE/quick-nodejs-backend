import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import getRoutes, { GetRoutesProps } from './lib/getRoutes';
import Error from './error/index';
import checkInitializeProjectSettings from './lib/checkInitializeProjectSettings';

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

getRoutes().forEach((data: GetRoutesProps) => {
  app.use(data.path || '/', data.router);
});

// 404
app.use((req) => {
  Error.PageNotFound(req.url);
});

// Error handler
app.use((error: any, req: any, res: any, next: any) => {
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
