/** @format */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

import getRoutes, { GetRoutesProps } from './lib/getRoutes';
import Error from './error/index';
import checkInitializeProjectSettings from './lib/checkInitializeProjectSettings';

checkInitializeProjectSettings();

app.use(helmet());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'development'
        ? '*'
        : process.env.REQUEST_URI || '*',
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

getRoutes().forEach((data: GetRoutesProps) => {
  app.use(data.path || '/', data.router);
});

// 404
app.use((req) => {
  Error.PageNotFound(req.url);
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((error: any, req: any, res: any, next: any) => {
  const status = error.status || 500;
  const message =
    error.message && error.expose
      ? error.message
      : 'An error has occurred. Please Try Again.';
  const code = error.code;
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
});

export default app;
