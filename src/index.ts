import http from 'http';
import chalk from 'chalk';
import app from '@src/app';
import io from '@src/io';
import connectDB from '@lib/startup/connectDB';
import logger from '@lib/logger';

const PORT = parseInt(process.env.PORT || '4000', 10);
const server = http.createServer(app);
// io(server); // Enable when using socket.io

async function Root(): Promise<Record<string, any> | http.Server> {
  logger.info(
    'Created project TSNODE-backend-template by HADMARINE(https://github.com/hadmarine)',
  );

  if (process.env.NODE_ENV === 'test') {
    await connectDB();
    return server;
  }

  process.env.NODE_ENV = process.env.NODE_ENV
    ? process.env.NODE_ENV
    : 'development';

  let port;

  // tslint:disable-next-line: no-floating-promises
  connectDB()
    .then(() => {
      if (process.env.NODE_ENV === 'test') return;
      port = listen();
    })
    .catch((e) => {
      logger.error('MongoDB Server connection failed.');
      logger.debug(e);
    });
  return { server, port };
}

function listen(port: number = PORT): number {
  if (port <= 0 || port >= 65536) {
    logger.error(`PORT Range is Invalid. Recieved port : ${port}`);

    if (process.env.PORT_STRICT === 'true') {
      logger.error(
        ' Set PORT_STRICT to false on your .env if you want to execute anyway.',
      );
      throw new Error('PORT STRICT');
    }
    port = 20000;
    logger.info(`Retrying with Port ${port}`);
  }
  server.listen(port);

  let isError = false;
  server.once('error', (err: any) => {
    if (process.env.PORT_STRICT === 'true') {
      logger.error(` Port ${port} is already in use.`);
      logger.info(
        'Set PORT_STRICT to false on your .env if you want to execute anyway.',
      );
      throw new Error('PORT STRICT');
    }
    if (err.code === 'EADDRINUSE') {
      logger.info(
        `Port ${port} is currently in use. Retrying with port ${port + 1}`,
      );
      const newPort = port === 65535 ? 20000 : port + 1;
      listen(newPort);
      isError = true;
    }
  });
  server.once('listening', () => {
    if (!isError) {
      logger.success(
        chalk.black.bgGreen(` App started on port `) +
          chalk.green.bold(` ${port}`),
      );
    }
  });
  return port;
}

export default Root();
