/** @format */

import chalk from 'chalk';
import fs from 'fs';

require('dotenv').config();

const instructions =
  chalk.bgCyan.black('\nSee instructions:') +
  chalk.cyan(
    ' https://github.com/WebBoilerplates/Typescript-Node-Express-Mongodb-backend#envdotenv'
  );

export default function checkInitializeProjectSettings(): void {
  try {
    fs.accessSync('.env', fs.constants.F_OK);
  } catch (e) {
    const error =
      chalk.blackBright.bgRed('Error:') +
      chalk.red(' Set your .env file.') +
      instructions;
    throw new Error(error + e);
  }

  if (!process.env.REQUEST_URI) {
    console.error(
      chalk.black.bgYellow('Warning:') +
        chalk.yellow(
          ' process.env.REQUEST_URI IS NOT DEFINED. ANY ORIGIN REQUEST WOULD BE ALLOWED IF NOT DEFINED.'
        ) +
        instructions
    );
  }

  if (
    !process.env.DB_HOST ||
    !process.env.DB_NAME ||
    !process.env.DB_USER ||
    !process.env.DB_PASS
  ) {
    throw new Error(
      chalk.blackBright.bgRed('Error:') +
        chalk.red(' MONGO_DB Data is not provided properly at .env') +
        instructions
    );
  }
}
