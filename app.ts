import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
const bodyParser = require('body-parser');

const app = express();

import throwError from './src/lib/throwError';
import getRoutes from './src/lib/getRoutes';
import Error from './src/error/index';

const routes = getRoutes();

app.use(helmet());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'development'
        ? '*'
        : process.env.REQUEST_URI || '*'
  })
);

app.use(bodyParser.json({ extended: true }));

try {
  require('./.env');
} catch (e) {
  console.error('Set your .env file, or it will occur error.');
  console.error(
    'See instructions : https://github.com/WebBoilerplates/Typescript-Node-Express-Mongodb-backend#envdotenv'
  );
  throw e;
}

if (!process.env.REQUEST_URI) {
  console.error(
    'Error: process.env.REQUEST_URI IS NOT DEFINED. ANY ORIGIN REQUEST WOULD BE ALLOWED IF NOT DEFINED.'
  );
  console.error(
    'See instructions : https://github.com/WebBoilerplates/Typescript-Node-Express-Mongodb-backend#envdotenv'
  );
}

routes.forEach((data: any) => {
  app.use(data.path || '/', data.router);
});

// 404
app.use(req => {
  Error.PageNotFound(req.url);
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
