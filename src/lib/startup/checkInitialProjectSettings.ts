/**
 * THIS FUNCTION HAVE TO BE EXECUTED BEFORE OF ANY FUNCTION OR DECLARATION.
 * IF YOU DONT, ENVIRONMENT MIGHT BE CORRUPTED.
 */

import logger from 'clear-logger';
logger.clear();
logger.info('Starting server...');

import chalk from 'chalk';
import * as dotenv from 'dotenv';
import qcert from 'quickcert';
dotenv.config();

const instructions =
  chalk.bgCyan.black('See instructions:') +
  chalk.cyan(
    ' https://github.com/WebBoilerplates/Typescript-Node-Express-Mongodb-backend#envdotenv',
  );

export default function checkInitializeProjectSettings(): void {
  try {
    qcert.verifyCertificates();
  } catch (e) {
    logger.error('QuickCert.js not initialized properly.');
    process.exit(1);
  }

  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
  }

  if (!process.env.REQUEST_URI) {
    logger.warn(
      'process.env.REQUEST_URI IS NOT DEFINED. ANY ORIGIN REQUEST WOULD BE ALLOWED IF NOT DEFINED.',
    );
    logger.plain(instructions);
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
