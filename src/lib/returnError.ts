import { defaultMessage, defaultCode } from '@lib/httpCode';
import logger, { debugLogger } from '@lib/logger';

interface Options {
  log?: boolean;
  data?: object;
  expose?: boolean;
}

const optionsDefault = {
  log: false,
  data: {},
};

function returnError(
  message: string | null,
  status: number = 500,
  code: string | null,
  options: Options = optionsDefault,
): Error {
  const error: any = new Error(message || defaultMessage(status));
  error.expose = options.expose || true;
  error.status = status;
  error.code = code || defaultCode(status);

  error.data = options.data || {};

  if (options.log) {
    debugLogger(error.stack, true);
  }

  return error;
}

export default returnError;
