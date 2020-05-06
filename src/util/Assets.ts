import error from '@error';
import rateLimiter from 'express-rate-limit';
import { RequestHandler, NextFunction, Response, Request } from 'express';

function getObjectKeyByValue(object: any, value: string): string | undefined {
  return Object.keys(object).find((key) => object[key] === value);
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

function checkJong(value: string): boolean {
  const result = value.charCodeAt(value.length - 1);
  return (result - 0xac00) % 28 > 0;
}

function checkNull(...param: any[]): void {
  param.forEach((data) => {
    if (!data) {
      throw error.data.parameternull();
    }
  });
}

function apiRateLimiter(
  standardTimeRate = 5,
  limitRate = 100,
): rateLimiter.RateLimit {
  return rateLimiter({
    windowMs: standardTimeRate * 60 * 1000,
    max: limitRate,
  });
}

function sleep(ms: number): Promise<number> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function delayExact(startTime: number, totalDelay = 500): Promise<void> {
  let currentDate = null;
  do {
    await sleep(100);
    currentDate = Date.now();
  } while (currentDate - startTime < totalDelay);
}

function wrapper(requestHandler: any): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(requestHandler(req, res, next)).catch((e) => {
      next(e);
    });
  };
}

function returnArray(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch {
      data = JSON.parse(`[${data}]`);
    }
  }
  return data;
}

function verifyEmail(email: string): void {
  const emailRegex = new RegExp(
    /^(?:[a-zA-Z0-9])([-_0-9a-zA-Z]+(\.[-_0-9a-zA-Z]+)*|^\"([\001-\010\013\014\016-\037!#-\[\]-\177]|\\[\001-011\013\014\016-\177])*\")@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}\.?$/,
  ); // if true. valid
  if (!emailRegex.test(email)) {
    throw error.data.parameterInvalid('email');
  }
  return;
}

function verifyPhone(phone: string): void {
  const phoneRegex = new RegExp(/((?![0-9-]).)/g); // if true, invalid.
  if (phoneRegex.test(phone)) {
    throw error.data.parameterInvalid('phone');
  }
}

function filterType(param: any, type: string): any {
  if (typeof param !== type) {
    throw error.data.parameterInvalid();
  }
  return param;
}

export default {
  getObjectKeyByValue,
  getRandomNumber,
  checkJong,
  checkNull,
  apiRateLimiter,
  sleep,
  delayExact,
  wrapper,
  returnArray,
  data: {
    verify: {
      email: verifyEmail,
      phone: verifyPhone,
    },
    filter: filterType,
  },
};
