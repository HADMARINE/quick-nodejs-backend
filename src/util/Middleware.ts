import { NextFunction, Request, RequestHandler, Response } from 'express';
import error from '@error/ErrorDictionary';
import Auth from '@util/Auth';
import rateLimiter from 'express-rate-limit';

export async function AdminAuthority(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const tokenPayload =
      req.headers['x-access-token'] || req.query['x-access-token'];
    if (typeof tokenPayload !== 'string') {
      return next(error.auth.tokenInvalid());
    }
    const tokenValue = await Auth.token.verify.manual(tokenPayload);
    if (tokenValue.authority !== 'admin') {
      return next(error.auth.access.lackOfAuthority());
    }
    req.body.userData = await Auth.token.verify.manual(tokenPayload);
    next();
  } catch (e) {
    next(e);
  }
}

export function SpecifiedAuthority(...authority: string[]): RequestHandler {
  return async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const tokenPayload =
        req.headers['x-access-token'] || req.query['x-access-token'];
      if (typeof tokenPayload !== 'string') {
        return next(error.auth.tokenInvalid());
      }
      const tokenValue = await Auth.token.verify.manual(tokenPayload);
      if (
        authority.indexOf(tokenValue.authority) === -1 ||
        tokenValue.authority !== 'admin'
      ) {
        return next(error.auth.access.lackOfAuthority());
      }
      req.body.userData = await Auth.token.verify.manual(tokenPayload);
      next();
    } catch (e) {
      next(e);
    }
  };
}

export async function UserAuthority(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const tokenPayload =
      req.headers['x-access-token'] || req.query['x-access-token'];
    if (typeof tokenPayload !== 'string') {
      return next(error.auth.tokenInvalid());
    }
    req.body.userData = await Auth.token.verify.manual(tokenPayload);
    next();
  } catch (e) {
    next(e);
  }
}

export function RateLimiter(
  standardTimeRate = 5,
  limitRate = 100,
): rateLimiter.RateLimit {
  return rateLimiter({
    windowMs: standardTimeRate * 60 * 1000,
    max: limitRate,
    handler: (req, res, next) => next(error.connection.tooManyRequests()),
  });
}

export default {
  authority: {
    user: UserAuthority,
    admin: AdminAuthority,
    specify: SpecifiedAuthority,
  },
  ratelimiter: RateLimiter,
};
