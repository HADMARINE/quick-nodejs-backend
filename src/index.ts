import http from 'http';
import { Router } from 'express';
import chalk from 'chalk';
import app from '@src/app';
import connectDB from '@lib/startup/connectDB';
import logger from '@lib/logger';

const router = Router();
const server = http.createServer(app);

const PORT = parseInt(process.env.PORT || '4000', 10);

function listen(port: number = PORT): void {
  if (port <= 0 || port >= 65536) {
    logger(chalk.red(`PORT Range is Invalid. Recieved port : ${port}`), true);

    if (process.env.PORT_STRICT === 'true') {
      logger(
        chalk.black.bgRed('ERROR:') +
          chalk.yellow(
            ' Set PORT_STRICT to false on your .env if you want to execute anyway.',
          ),
        true,
      );
      throw new Error('PORT STRICT');
    }
    port = 20000;
    logger(chalk.bgYellow(`Retrying with Port ${port}`));
  }
  server.listen(port);

  let isError = false;
  server.once('error', (err: any) => {
    if (process.env.PORT_STRICT === 'true') {
      logger(
        chalk.black.bgRed('ERROR:') +
          chalk.red(` Port ${port} is already in use.\n`) +
          chalk.yellow(
            'Set PORT_STRICT to false on your .env if you want to execute anyway.',
          ),
        true,
      );
      throw new Error('PORT STRICT');
    }
    if (err.code === 'EADDRINUSE') {
      logger(
        chalk.yellow(
          `Port ${port} is currently in use. Retrying with port ${port + 1}`,
        ),
      );
      const newPort = port === 65535 ? 20000 : port + 1;
      listen(newPort);
      isError = true;
    }
  });
  server.once('listening', () => {
    if (!isError) {
      logger(
        chalk.black.bgGreen(`App started on port`) +
          chalk.green.bold(` ${port}`),
      );
    }
  });
}

process.env.NODE_ENV = process.env.NODE_ENV
  ? process.env.NODE_ENV
  : 'development';

// tslint:disable-next-line: no-floating-promises
connectDB().then(() => {
  listen();
});

export default router;
