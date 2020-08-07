import chalk from 'chalk';
import fs from 'fs';
import logger from '@lib/logger';

require('dotenv').config();

const instructions =
  chalk.bgCyan.black('See instructions:') +
  chalk.cyan(
    ' https://github.com/WebBoilerplates/Typescript-Node-Express-Mongodb-backend#envdotenv',
  );

export default function checkInitializeProjectSettings(): void {
  try {
    fs.accessSync('.env', fs.constants.F_OK);
  } catch (e) {
    logger.error('Environment var file (.env) not detected.');
    logger.plain(instructions);
    throw new Error(e);
  }

  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
  }

  if (process.env.NODE_ENV === 'development') {
    logger.info(
      'Please install openssl (or libressl) to encrypt, decrypt .env files!',
    );
  }

  if (!process.env.REQUEST_URI) {
    logger.warn(
      'process.env.REQUEST_URI IS NOT DEFINED. ANY ORIGIN REQUEST WOULD BE ALLOWED IF NOT DEFINED.',
    );
    logger.plain(instructions);
  }

  if (
    !process.env.DB_HOST ||
    !process.env.DB_NAME ||
    !process.env.DB_USER ||
    !process.env.DB_PASS
  ) {
    logger.error('MONGO_DB Data is not provided properly at .env');
    logger.plain(instructions);
    throw new Error('DATABASE INFO NOT PROVIDED');
  }

  if (!process.env.TOKEN_KEY) {
    logger.warn(
      'TOKEN_KEY is not provided as env variable. It would cause security issues.',
    );
    if (process.env.NODE_ENV === 'production') {
      logger.error(
        'Stopping production server - MUST DEFINE TOKEN_KEY AT PRODUCTION',
      );
      throw new Error('TOKEN_KEY NOT PROVIDED');
    }
  }
}
