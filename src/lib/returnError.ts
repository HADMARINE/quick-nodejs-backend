import { defaultMessage, defaultCode } from '@lib/httpCode';
import logger from '@lib/logger';

interface Options {
  log?: boolean;
  data?: object;
}

const optionsDefault = {
  log: false,
  data: {},
};

function returnError(
  message: string | null,
  status = 500,
  code: string | null,
  options: Options = optionsDefault,
): Error {
  const error: any = new Error(message || defaultMessage(status));
  error.status = status;
  error.code = code || defaultCode(status);

  error.data = options.data || {};

  if (options.log || process.env.NODE_ENV === 'development') {
    logger.debug(error, true);
  }

  return error;
}

export default returnError;
