/** @format */

import chalk from 'chalk';

const env = process.env;

const instructions =
  chalk.bgCyan.black('\nSee instructions:') +
  chalk.cyan(
    ' https://github.com/WebBoilerplates/Typescript-Node-Express-Mongodb-backend#envdotenv'
  );

export default function checkInitializeProjectSettings() {
  try {
    require('../../.env');
  } catch (e) {
    const error =
      chalk.black.bgRed('Error:') +
      chalk.red(' Set your .env file.') +
      instructions;
    throw error;
  }

  if (!env.REQUEST_URI) {
    console.error(
      chalk.black.bgYellow('Warning:') +
        chalk.yellow(
          ' process.env.REQUEST_URI IS NOT DEFINED. ANY ORIGIN REQUEST WOULD BE ALLOWED IF NOT DEFINED.'
        ) +
        instructions
    );
  }

  if (!env.DB_HOST || !env.DB_NAME || !env.DB_USER || !env.DB_PASS) {
    const error =
      chalk.black.bgRed('Error:') +
      chalk.red(' MONGO_DB Data is not provided properly at .env') +
      instructions;
    throw error;
  }
}
