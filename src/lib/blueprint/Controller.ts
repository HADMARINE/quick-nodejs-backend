import { Response } from 'express';

import { defaultMessage, defaultCode } from '@lib/httpCode';

interface ResponseOptions {
  result?: boolean;
  message?: string | null;
  code?: string | null;
  additionalData?: Record<string, any> | null;
}

const optionsDefault = {
  result: true,
  message: null,
  code: null,
  additionalData: {},
};

export default class Controller {
  /**
   * @description Stricts response rule
   * @param {HTTPRequestCode} status 에러 코드
   * @returns {string} 에러 문자
   */
  public Response(
    res: Response,
    status: number,
    data?: any,
    options: ResponseOptions = optionsDefault,
  ) {
    res
      .status(status)
      .json({
        result: options.result,
        data,
        message: options.message || defaultMessage(status),
        code: options.code || defaultCode(status),
        ...options.additionalData,
      })
      .end();
  }
}
