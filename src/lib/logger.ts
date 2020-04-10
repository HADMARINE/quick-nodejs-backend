import chalk from 'chalk';
import moment from 'moment';

export default function logger(
  message: string,
  isError: boolean = false,
): void {
  const logger: Function = isError ? console.error : console.log;
  logger(
    `${chalk.gray(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] : `)}${message}`,
  );
}

export function debugLogger(message: string, printStack: boolean = true): void {
  if (process.env.NODE_ENV === 'production') return;
  const stack: string = new Error().stack || '_____UNDEFINED_____';
  logger(`${message}${printStack ? chalk.gray(stack.slice(7)) : ''}`);
}
