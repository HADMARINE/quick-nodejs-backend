/* eslint-disable @typescript-eslint/ban-ts-comment */
import mongoose from 'mongoose';
import fs from 'fs';
import tunnel from 'tunnel-ssh';
import _logger from 'clear-logger';
import portfinder from 'portfinder';
import deasync from 'deasync';

const logger = _logger.customName('MDB');

const env = process.env.NODE_ENV || 'development';

export let dbConnectionStatus:
  | 'NOT_CONNECTED'
  | 'CONN_SSL'
  | 'CONN_SSL_TUNNEL'
  | 'CONN_PLAIN_DEV'
  | 'CONN_PLAIN' = 'NOT_CONNECTED';

const auth = {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
};

const mongoURL = process.env.DB_HOST;
let dbName = process.env.DB_NAME;

if (env !== 'production') dbName += `_${env}`;
if (env === 'development') {
  mongoose.set('debug', true);
}

export default async function connectDB(): Promise<void> {
  try {
    if (
      (process.env.TEST_DB_HOST && process.env.NODE_ENV !== 'production') ||
      process.env.DB_ENV === 'development'
    ) {
      await connectDBTest();
      dbConnectionStatus = 'CONN_PLAIN_DEV';
      return;
    }

    if (!auth.user || !auth.pass || !dbName || !mongoURL) {
      throw new Error('MONGO ENV NOT SET');
    }

    if (!process.env.DB_SSL_KEY) {
      await mongoose.connect(mongoURL, {
        ...auth,
        dbName,
      });
      dbConnectionStatus = 'CONN_PLAIN';
    }

    if (process.env.NODE_ENV !== 'production') {
      if (
        !process.env.SSH_USERNAME ||
        !process.env.SSH_HOST ||
        !process.env.SSH_PORT ||
        !process.env.DEV_PORT ||
        !process.env.SSH_PRIV_KEY_LOC
      ) {
        throw new Error('ENV NOT SET');
      }

      const port = await portfinder.getPortPromise({
        port: 62000,
        stopPort: 65535,
      });

      logger.info(`Using port ${port} internally. (For SSH Tunneling)`);
      tunnel(
        {
          username: process.env.SSH_USERNAME,
          host: process.env.SSH_HOST,
          port: parseInt(process.env.SSH_PORT, 10),
          privateKey: fs.readFileSync(
            `${process.cwd()}/${process.env.SSH_PRIV_KEY_LOC}`,
          ),
          dstHost: new URL(mongoURL).hostname,
          dstPort: 27017,
          localHost: '127.0.0.1',
          localPort: port,
          keepAlive: false,
        },
        async (error, server) => {
          if (error) throw error;
          await mongoose.connect(`mongodb://localhost:${port}`, {
            ...auth,
            tlsAllowInvalidHostnames: true,
            dbName,
            ssl: true,
            sslCA: 
              fs.readFileSync(`${process.cwd()}/${process.env.DB_SSL_KEY}`).toString(),
            
          });
          dbConnectionStatus = 'CONN_SSL_TUNNEL';
        },
      );
      return;
    }

    await  mongoose.connect(mongoURL, {
      ...auth,
      dbName,
      ssl: true,
      sslCA: fs.readFileSync(`${process.cwd()}/${process.env.DB_SSL_KEY}`).toString(),
    });
    dbConnectionStatus = 'CONN_SSL';
  } catch (e) {
    logger.debug(e);
    logger.debug('Failed to initialize MongoDB server connection', false);
    process.exit(1);
  }
}

export const wrapConnectDbWithSync = (): void => {
  enum status {
    'INITIAL',
    'RESOLVED',
    'ERROR',
  }

  let STATUS = status.INITIAL;

  connectDB()
    .then(() => {
      STATUS = status.RESOLVED;
    })
    .catch((e) => {
      STATUS = status.ERROR;
      throw e;
    });
  // @ts-ignore
  while (STATUS !== status.RESOLVED) {
    deasync.sleep(200);
    // @ts-ignore
    if (STATUS === status.ERROR) throw new Error('Mongodb connection failed');
  }
  logger.debug(`MongoDB Connected. MODE:[ ${dbConnectionStatus} ]`, false);
};

export const connectDBTest = (): Promise<typeof mongoose | undefined> => {
  if (
    !process.env.TEST_DB_HOST ||
    !process.env.TEST_DB_NAME ||
    !process.env.TEST_DB_USER ||
    !process.env.TEST_DB_PASS
  ) {
    throw new Error('Test DB Not defined');
  }
  try {
    return mongoose.connect(process.env.TEST_DB_HOST, {
      ...{
        user: process.env.TEST_DB_USER,
        pass: process.env.TEST_DB_PASS, 
      },
      dbName: process.env.TEST_DB_NAME,
    });
  } catch (e) {
    throw e;
  }
};
