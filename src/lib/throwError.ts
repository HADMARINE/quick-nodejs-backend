import { defaultMessage, defaultCode } from '@lib/httpCode';

interface Options {
  log?: boolean;
  data?: object;
  expose?: boolean;
}

const optionsDefault = {
  log: false,
  data: {},
};

function throwError(
  message: string | null,
  status: number = 500,
  code: string | null,
  options: Options = optionsDefault,
): void {
  const error: any = new Error(message || defaultMessage(status));
  error.expose = options.expose || true;
  error.status = status;
  error.code = code || defaultCode(status);

  error.data = options.data || {};

  if (options.log) {
    console.error(error.stack);
  }

  throw error;
}

export default throwError;
