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
   * @param {Response} res response method
   * @param {number} status HTTP Status code
   * @param {Record<string, any>} data Response data
   * @param {ResponseOptions} Options Response options
   * @returns {void} Nothing
   */
  public Response(
    res: Response,
    status: number,
    data?: Record<string, any>,
    options: ResponseOptions = optionsDefault,
  ): void {
    res
      .status(status)
      .json({
        status,
        code: options.code || defaultCode(status),
        message: options.message || defaultMessage(status),
        result: options.result,
        data,
        ...options.additionalData,
      })
      .end();
  }
}
