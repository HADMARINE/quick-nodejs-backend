import error from '@error';
import rateLimiter from 'express-rate-limit';
import { RequestHandler, NextFunction, Response, Request } from 'express';
import deasync from 'deasync';
import logger from '@lib/logger';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

function getObjectKeyByValue(object: any, value: string): string | undefined {
  return Object.keys(object).find((key) => object[key] === value);
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max + 1 - min) + min);
}

function checkJong(value: string): boolean {
  const result = value.charCodeAt(value.length - 1);
  return (result - 0xac00) % 28 > 0;
}

function checkNull(...param: any[]): any[] {
  param.forEach((data) => {
    if (!data) {
      throw error.data.parameterNull();
    }
  });
  return param;
}

function apiRateLimiter(
  standardTimeRate = 5,
  limitRate = 100,
): rateLimiter.RateLimit {
  return rateLimiter({
    windowMs: standardTimeRate * 60 * 1000,
    max: limitRate,
    handler: (req, res) =>
      res.status(429).json({
        result: false,
        ...error.access.tooManyRequests(),
        message: 'Too many requests',
      }),
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

function wrapper(requestHandler: RequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(requestHandler(req, res, next)).catch((e) => {
      next(e);
    });
  };
}

function returnArray(data: any): any[] {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch {
      data = JSON.parse(`[${data}]`);
    }
  }
  return data;
}

function returnRecord(data: any): Record<any, any> | null {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch {
      return null;
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

function filterType(param: any, type: string): any | undefined {
  if (typeof param !== type && typeof param !== 'undefined') {
    if (type === 'number') {
      try {
        return parseInt(param, 10);
      } catch {}
    }
    throw error.data.parameterInvalid();
  }
  return param;
}

function updateQueryBuilder(
  doc: Record<string, any> | any[],
  allowDepth = -1,
  currentDepth = 0,
): Record<string, any> | any[] | undefined {
  if (Array.isArray(doc)) {
    const arrVal = [];
    for (const v of doc) {
      if (v) {
        if (typeof v === 'object' && JSON.stringify(v) === '{}') {
          continue;
        }
        arrVal.push(v);
      }
    }
    if (arrVal.length === 0) return undefined;
    return arrVal;
  }
  const result = {};
  Object.keys(doc).forEach((key) => {
    const value = doc[key];
    if (
      typeof value === 'object' &&
      value !== null &&
      (allowDepth === -1 || currentDepth < allowDepth)
    ) {
      Object.assign(result, {
        [key]: updateQueryBuilder(value, allowDepth, currentDepth + 1),
      });
    } else if (value !== undefined) {
      if (Array.isArray(value)) {
        if ((value as any[]).length === 0) {
          return;
        }
        const val: any[] = [];
        (value as any[]).forEach((v) => {
          if (v) {
            if (typeof v === 'object' && JSON.stringify(v) === '{}') {
              return;
            }
            val.push(v);
          }
        });
        if (val.length === 0) return;
        Object.assign(result, { [key]: val });
      } else {
        Object.assign(result, { [key]: value });
      }
    }
  });
  return result;
}

const DEFAULT_TIMEOUTS = 10 * 1000;

const STATE = {
  INITIAL: 'INITIAL',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED',
};

const DEFAULT_TICK = 100;

function syncifyFunction<T>(
  func: Function,
  options: { timeout?: number; tick?: number } = {},
): any {
  logger.error('syncifyFunction is currently not working properly!');
  return (...args: any[]) => {
    let promiseError;
    let promiseValue;
    let promiseStatus = STATE.INITIAL;
    const timeouts = options.timeout || DEFAULT_TIMEOUTS;
    const tick = options.tick || DEFAULT_TICK;

    func(...args)
      .then((value: T) => {
        console.log(value);
        promiseValue = value;
        promiseStatus = STATE.RESOLVED;
      })
      .catch((e: any) => {
        console.log(e);
        promiseError = e;
        promiseStatus = STATE.REJECTED;
      });

    const waitUntil = new Date(new Date().getTime() + timeouts);
    while (waitUntil > new Date() && promiseStatus === STATE.INITIAL) {
      console.log(promiseStatus, waitUntil, promiseValue, promiseError);
      deasync.sleep(tick);
    }

    if (promiseStatus === STATE.RESOLVED) {
      return promiseValue;
    } else if (promiseStatus === STATE.REJECTED) {
      throw promiseError;
    } else {
      throw new Error(`${func.name} called timeout`);
    }
  };
}

function dirCollector(dirname: string): Record<string, any> {
  const dirs: string[] = fs.readdirSync(dirname);
  const datas: Record<string, any> = {};

  for (const f of dirs) {
    const file: any = path.join(dirname, f);
    const stat = fs.statSync(file);
    if (f.match(/index\.(ts|js)/) || f.match(/example/)) {
      continue;
    }
    if (stat.isDirectory()) {
      datas[f] = dirCollector(file);
      continue;
    }
    try {
      datas[f.replace(/\.(js|ts)$/g, '')] = require(file).default;
    } catch (e) {
      logger.error('Error while getting datas with dirCollector : ' + e);
    }
  }
  return datas;
}

function encryptSymmetry(value: string): string {
  if (!process.env.CIPHER_KEY) throw new Error('Could not resolve Cipher key');
  const cipher = crypto.createCipher('aes-256-cbc', process.env.CIPHER_KEY);
  let result = cipher.update(value, 'utf8', 'base64');
  result += cipher.final('base64');
  return result;
}

function decryptSymmetry(value: string): string {
  if (!process.env.CIPHER_KEY) throw new Error('Could not resolve Cipher key');
  const decipher = crypto.createDecipher('aes-256-cbc', process.env.CIPHER_KEY);
  let result = decipher.update(value, 'base64', 'utf8');
  result += decipher.final('utf8');
  return result;
}

type verificationTypes =
  | 'object'
  | 'object-nullable'
  | 'number'
  | 'number-nullable'
  | 'boolean'
  | 'boolean-nullable'
  | 'string'
  | 'string-nullable'
  | 'function'
  | 'function-nullable'
  | 'any'
  | 'array'
  | 'array-nullable'
  | 'notnull';

type RequestVerificationBuilderProps = verificationTypes;

function verifyData(data: any, type: verificationTypes, key: string): any {
  if (type === 'any') {
    return data;
  }

  const nullableFlag = type.slice(-8) === 'nullable';

  if (nullableFlag) {
    type = type.slice(0, -9) as verificationTypes;
  }

  if (!data) {
    if (nullableFlag) {
      return null;
    }
    throw error.data.parameterNull(key);
  }

  switch (type) {
    case 'notnull':
      return data;
    case 'array':
      if (Array.isArray(data)) {
        return data;
      }
      const a = returnArray(data);

      if (Array.isArray(a)) {
        return a;
      }
      throw error.data.parameterInvalid(key);
    case 'boolean':
      if (typeof data === 'boolean') {
        return data;
      }

      if (typeof data === 'string') {
        switch (data) {
          case 'true':
            return true;
          case 'false':
            return false;
          default:
            throw error.data.parameterInvalid(key);
        }
      }

      throw error.data.parameterInvalid(key);
    case 'object':
      if (typeof data === 'object') {
        return data;
      }
      const r = returnRecord(data);
      if (r === null || typeof r !== 'object') {
        throw error.data.parameterInvalid(key);
      }
      return r;

    case 'function':
      logger.debug('Verifying function has no effect. Returning raw data.');
      return data;

    case 'string':
      if (typeof data === 'string') {
        return data;
      }
      throw error.data.parameterInvalid(key);

    case 'number':
      if (isNaN(data)) {
        throw error.data.parameterInvalid(key);
      }
      return parseFloat(data);

    default:
      throw error.data.parameterInvalid(key);
  }
  // return type === typeof data;
}

const verificationProcessor = <T>(props: RequestVerificationBuilderProps) => {
  return function (rawData: Record<string, any>, key: string): T {
    const targetData = rawData[key];

    return verifyData(targetData, props, key);
  };
};

function requestVerificationBuilder<T>(
  type: RequestVerificationBuilderProps,
): (rawData: Record<string, any>, key: string) => T {
  return verificationProcessor<T>(type);
}

function getRequestWithVerification(data: Record<string, any>) {
  return function (
    processors: Record<string, verificationTypes>,
  ): Record<string, any> {
    const returnValue = {};

    Object.keys(processors).forEach((key) => {
      const processor = requestVerificationBuilder(processors[key]);
      const result = processor(data, key);
      Object.assign(returnValue, { [key]: result });
      // const value = (returnValue[key] = result[key]);
    });

    return returnValue;
  };
}

export type VerifierWrapperInnerFunction = (
  processors: Record<string, verificationTypes>,
) => Record<string, any>;

export default {
  updateQueryBuilder,
  getObjectKeyByValue,
  getRandomNumber,
  checkJong,
  checkNull,
  apiRateLimiter,
  sleep,
  delayExact,
  wrapper,
  returnArray,
  returnRecord,
  syncifyFunction,
  data: {
    verify: {
      email: verifyEmail,
      phone: verifyPhone,
    },
    filter: filterType,
    paramVerifier: {
      builder: requestVerificationBuilder,
      wrapper: getRequestWithVerification,
    },
  },
  encryption: {
    symmetry: {
      encrypt: encryptSymmetry,
      decrypt: decryptSymmetry,
    },
  },
  dirCollector,
};
