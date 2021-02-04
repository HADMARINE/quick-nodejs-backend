import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import fileUploader from 'express-fileupload';

import getRoutes from '@lib/startup/getRoutes';
import checkInitialProjectSettings from '@lib/startup/checkInitialProjectSettings';
import error from '@error';
import errorHandler from '@lib/middlewares/errorHandler';
import Assets from '@util/Assets';
import cron from '@lib/middlewares/cron';
import ipfilter from '@lib/middlewares/ipfilter';
import morgan from '@lib/middlewares/morgan';

const app = express();

function App(): Express {
  // Check Initial Environment Settings
  checkInitialProjectSettings();
  cron();

  // Enable if you're behind a reverse proxy
  // see https://expressjs.com/en/guide/behind-proxies.html
  // app.set('trust proxy', 1);

  // Morgan Logger
  app.use(morgan());

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
  app.use(Assets.wrapper(ipfilter));

  // express-fileupload
  app.use(
    fileUploader({
      limits: { fileSize: 50 * 1024 * 1024 },
      useTempFiles: true,
      tempFileDir: '/tmp/file/',
      debug: process.env.NODE_ENV === 'development',
    }),
  );

  // Public files
  app.use(express.static('public'));

  // Parser
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Auto Routing
  getRoutes().forEach((data) => {
    app.use(data.path || '/', data.router);
  });

  // 404
  app.use((req) => {
    throw error.access.pageNotFound(`${req.method} ${req.url}`);
  });

  // Error handler
  app.use(errorHandler);

  return app;
}

export default App();
