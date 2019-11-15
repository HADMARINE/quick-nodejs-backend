import express from 'express';
import cors from 'cors';
const bodyParser = require('body-parser');

const app = express();

import throwError from './src/lib/throwError';
import getRoutes from './src/lib/getRoutes';

const routes = getRoutes();

app.use(
  cors({
    origin: process.env.NODE_ENV === 'development' ? '*' : 'YOUR_DOMAIN.com'
  })
);
app.use(bodyParser.json({ extended: true }));

routes.forEach((data: any) => {
  app.use(data.path || '/', data.router);
});

// 404 처리 핸들러
app.use(() => {
  // throwError를 통한 에러 핸들링 권장.
  throwError('Page Not found.', 404);
});
// Error 처리 핸들러

app.use((error: any, req: any, res: any, next: any) => {
  const status = error.status || 500;
  const message =
    error.message && error.expose
      ? error.message
      : 'An error has occurred. Please Try Again.';
  const data = error.data || {};

  if (!error.expose || process.env.NODE_ENV === 'development') {
    console.error(error);
  }

  res.status(status).json({
    status,
    message,
    ...data
  });
});

module.exports = app;
