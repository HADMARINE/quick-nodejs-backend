import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import fileUploader from 'express-fileupload';

import getRoutes from '@lib/startup/getRoutes';
import checkInitializeProjectSettings from '@lib/startup/checkInitializeProjectSettings';
import error from '@error';
import errorHandler from '@lib/middlewares/errorHandler';
import Assets from '@util/Assets';

const app = express();

// Check Initial Environment Settings
checkInitializeProjectSettings();

// Security settings
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'development'
        ? '*'
        : process.env.REQUEST_URI || '*',
  }),
);
app.use(helmet());
app.use(Assets.apiRateLimiter());

// Morgan Logger
app.use(
  morgan(
    '[:date[iso]]: :method :url - :status(:total-time[3]ms) [:remote-addr :user-agent HTTP::http-version]',
    {
      stream: fs.createWriteStream(path.join(__dirname, 'tmp/access.log'), {
        flags: 'a',
      }),
    },
  ),
);

// express-fileupload
app.use(
  fileUploader({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: '/tmp/file/',
    debug: process.env.NODE_ENV === 'development' ? true : false,
  }),
);

// Parser
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Public files
app.use(express.static('public'));

// Auto Routing
getRoutes().forEach((data) => {
  app.use(data.path || '/', data.router);
});

// 404
app.use((req) => {
  throw error.access.pagenotfound(req.url);
});

// Error handler
app.use(errorHandler);

export default app;
