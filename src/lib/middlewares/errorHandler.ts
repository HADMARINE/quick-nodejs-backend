import { Request, Response, NextFunction } from 'express';
import { defaultMessage, defaultCode } from '@lib/httpCode';
import { debugLogger } from '@lib/logger';

interface MiddlewareError {
  status?: number;
  message?: string;
  code?: string;
  data?: Record<string, any>;
}

export default (
  error: MiddlewareError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status = error.status || 500;
  const message = error.message || defaultMessage(status);
  const code = error.code || defaultCode(status);
  const data = error.data || {};

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
