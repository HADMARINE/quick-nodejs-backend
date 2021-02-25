import { Request, Response, NextFunction } from 'express';
import { defaultMessage, defaultCode } from '@lib/httpCode';
import { IpDeniedError } from 'express-ipfilter';
import logger from 'clear-logger';

interface MiddlewareError {
  status?: number;
  message?: string;
  code?: string;
  data?: Record<string, any>;
}

export default (
  error: MiddlewareError | any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const status = error.status || 500;
  const message = error.message || defaultMessage(status);
  const code = error.code || defaultCode(status);
  const data = error.data || {};

  logger.debug(error);

  if (error instanceof IpDeniedError) {
    res
      .status(400)
      .json({
        status: 400,
        message: 'Your ip is banned!',
        code: 'IP_BAN',
        result: false,
      })
      .end();
    return;
  }

  res
    .status(status)
    .json({
      status,
      message,
      code,
      result: false,
      ...data,
    })
    .end();
};
