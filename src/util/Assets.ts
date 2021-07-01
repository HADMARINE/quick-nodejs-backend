import error from '@error/ErrorDictionary';
import { RequestHandler, NextFunction, Response, Request } from 'express';
import logger from 'clear-logger';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

function getObjectKeyByValue(
  object: Record<string, any>,
  value: string,
): string | undefined {
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

function returnArray<T>(data: any): T[] {
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

function verifyEmail(email: string): boolean {
  const emailRegex = new RegExp(
    /^(?:[a-zA-Z0-9])([-_0-9a-zA-Z]+(\.[-_0-9a-zA-Z]+)*|^\"([\001-\010\013\014\016-\037!#-\[\]-\177]|\\[\001-011\013\014\016-\177])*\")@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}\.?$/,
  ); // if true. valid
  if (!emailRegex.test(email)) {
    return false;
  }
  return true;
}

function verifyPhone(phone: string): boolean {
  const phoneRegex = new RegExp(/((?![0-9-]).)/g); // if true, invalid.
  if (phoneRegex.test(phone)) {
    return false;
  }
  return true;
}

function filterType<T>(param: any, type: string): T | undefined {
  if (typeof param !== type && typeof param !== 'undefined') {
    if (type === 'number') {
      try {
        return parseInt(param, 10) as unknown as T;
      } catch {}
    }
    throw error.data.parameterInvalid();
  }
  return param;
}

// TODO : improve type of this!
export function QueryBuilder<T>(
  doc: T,
  allowDepth = -1,
  currentDepth = 0,
):
  | Record<NonNullable<keyof T>, NonNullable<ValueOf<T>>>
  | NonNullable<ValueOf<T>>[]
  | any
  | undefined {
  if (Array.isArray(doc)) {
    const arrVal: ValueOf<T>[] = [];
    for (const v of doc) {
      if (v) {
        if (typeof v === 'object' && JSON.stringify(v) === '{}') {
          continue;
        }
        arrVal.push(v);
      }
    }
    if (arrVal.length === 0) return undefined;
    return arrVal as NonNullable<ValueOf<T>>[];
  }
  const result = {};
  if (doc !== null && typeof doc === 'object') {
    Object.keys(doc).forEach((key) => {
      const value = (doc as Record<string, any>)[key];
      if (
        typeof value === 'object' &&
        value !== null &&
        (allowDepth === -1 || currentDepth < allowDepth)
      ) {
        Object.assign(result, {
          [key]: QueryBuilder(value, allowDepth, currentDepth + 1),
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
        } else if (value === null) {
          return;
        } else {
          Object.assign(result, { [key]: value });
        }
      }
    });
    return result as any;
  }
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

export default {
  updateQueryBuilder: QueryBuilder,
  getObjectKeyByValue,
  getRandomNumber,
  checkJong,
  checkNull,
  sleep,
  delayExact,
  wrapper,
  returnArray,
  returnRecord,
  data: {
    verify: {
      email: verifyEmail,
      phone: verifyPhone,
    },
    filter: filterType,
    // paramVerifier: {
    //   builder: requestVerificationBuilder,
    //   wrapper: getRequestWithVerification,
    // },
  },
  encryption: {
    symmetry: {
      encrypt: encryptSymmetry,
      decrypt: decryptSymmetry,
    },
  },
  dirCollector,
};
