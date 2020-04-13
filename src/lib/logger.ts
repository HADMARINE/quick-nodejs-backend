import chalk from 'chalk';
import moment from 'moment';

function logger(message: string, isError: boolean = false): void {
  const logger: Function = isError ? console.error : console.log;
  logger(
    `${chalk.gray(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]: `)}${message}`,
  );
}

function debugLogger(message: any, printStack: boolean = true): void {
  if (process.env.NODE_ENV === 'production') return;
  const stack: string = new Error().stack || '_____UNDEFINED_____';
  logger(
    `${chalk.bgCyan.black(` DEBUG `)}${chalk.cyan(
      ` ${message}${printStack ? chalk.gray(stack.slice(7)) : ''}`,
    )}`,
  );
}

function warn(...message: string[]) {
  logger(`${chalk.bgYellow.black(` WARNING `)} ${chalk.yellow(...message)}`);
}

function error(...message: string[]) {
  logger(`${chalk.bgRed.black(` ERROR `)} ${chalk.red(...message)}`, true);
}

function info(...message: string[]) {
  logger(`${chalk.bgWhite.black(` INFO `)} ${chalk.white(...message)}`);
}

function success(...message: string[]) {
  logger(`${chalk.bgGreen.black(` SUCCESS `)} ${chalk.green(...message)}`);
}

export default {
  error,
  warn,
  info,
  plain: logger,
  debug: debugLogger,
  success,
};
