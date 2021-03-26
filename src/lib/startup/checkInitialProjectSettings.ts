/**
 * THIS FUNCTION HAVE TO BE EXECUTED BEFORE OF ANY FUNCTION OR DECLARATION.
 * IF YOU DONT, ENVIRONMENT MIGHT BE CORRUPTED.
 */

import logger from 'clear-logger';
logger.clear();
logger.info('Starting server...');

import chalk from 'chalk';
import fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

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
    logger.warn(
      'MONGO_DB Data is not provided properly at .env - mongoose initialization will not proceeded.',
    );
    logger.plain(instructions);
    // throw new Error('DATABASE INFO NOT PROVIDED');
  }

  if (!process.env.TOKEN_KEY) {
    logger.warn(
      'TOKEN_KEY is not provided as env variable. Due to potential of security issues, program will not executed on production mode if not provided.',
    );
    if (process.env.NODE_ENV === 'production') {
      logger.error(
        'Stopping production server - MUST DEFINE TOKEN_KEY AT PRODUCTION',
      );
      throw new Error('TOKEN_KEY NOT PROVIDED');
    }
  }
}
