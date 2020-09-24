console.clear();
import logger from '@lib/logger';
logger.info('Starting server...');
import http from 'http';
import app from '@src/app';
import chalk from 'chalk';
import io from '@src/io';
import connectDB from '@lib/startup/connectDB';

const PORT: number = parseInt(process.env.PORT || '4000', 10);
const server = http.createServer(app);
io(server); // Enable when using socket.io

function listen(port = PORT): number {
  if (port <= 0 || port >= 65536) {
    logger.error(`PORT Range is Invalid. Recieved port : ${port}`);

    if (process.env.PORT_STRICT === 'true') {
      logger.error(
        ' Set PORT_STRICT to false on your .env if you want to execute anyway.',
      );
      throw new Error('PORT STRICT ERROR');
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
      const newPort = port > 65535 ? 20000 : port + 1;
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

async function Root(): Promise<Record<string, any> | http.Server> {
  if (process.env.NODE_ENV === 'test') {
    await connectDB();
    return server;
  }

  let port;
  connectDB()
    .then(() => {
      if (process.env.NODE_ENV === 'test') return;
      port = listen();
    })
    .catch((e) => {
      logger.error('MongoDB Server connection failed.');
      logger.debug(e);
      process.exit(1);
    });
  return {
    server,
    port,
  };
}

export default Root();
