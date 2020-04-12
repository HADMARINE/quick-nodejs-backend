import error from '@error';
import rateLimiter from 'express-rate-limit';

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

function checkNull(param: Array<any>): void {
  param.forEach((data) => {
    if (!data) {
      throw error.data.parameternull();
    }
  });
}

function apiRateLimiter(
  standardTimeRate: number = 15,
  limitRate: number = 100,
) {
  return rateLimiter({
    windowMs: standardTimeRate * 60 * 1000,
    max: limitRate,
  });
}

export default {
  getObjectKeyByValue,
  getRandomNumber,
  checkJong,
  checkNull,
  apiRateLimiter,
};
