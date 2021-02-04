import chalk from 'chalk';
import moment from 'moment';

function logger(message: string, isError = false): void {
  const out: Function = isError ? console.error : console.log;
  out(
    `${chalk.gray(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]: `)}${message}`,
  );
}

function debugLogger(message: any, printStack = true): void {
  if (process.env.NODE_ENV === 'production') return;
  const stack: string = new Error().stack || '_____UNDEFINED_____';
  logger(
    `${chalk.bgCyan.black(` DEBG `)}${chalk.cyan(
      ` ${message}${printStack ? chalk.gray(stack.slice(7)) : ''}`,
    )}`,
  );
}

function warn(...message: string[]): void {
  logger(`${chalk.bgYellow.black(` WARN `)} ${chalk.yellow(...message)}`);
}

function error(...message: string[]): void {
  logger(`${chalk.bgRed.black(` ERRR `)} ${chalk.red(...message)}`, true);
}

function info(...message: string[]): void {
  logger(`${chalk.bgWhite.black(` INFO `)} ${chalk.white(...message)}`);
}

function success(...message: string[]): void {
  logger(`${chalk.bgGreen.black(` SUCC `)} ${chalk.green(...message)}`);
}

export default {
  error,
  warn,
  info,
  plain: logger,
  debug: debugLogger,
  success,
};
