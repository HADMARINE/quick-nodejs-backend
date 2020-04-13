import {
  Response,
  Request,
  NextFunction,
  RequestHandler,
  Router,
} from 'express';

import { defaultMessage, defaultCode } from '@lib/httpCode';
import error from '@error';
import assets from '@util/Assets';
import auth from '@util/Auth';

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
   * @description To resolve Error and to reduce try-catch
   * @param {RequestHandler} requestHandler Request handler
   * @returns {RequestHandler} Returns request handler
   */
  public Wrapper(requestHandler: RequestHandler): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(requestHandler(req, res, next)).catch((e) => {
        next(e);
      });
    };
  }

  /**
   * @description Stricts response rule
   * @param {Response} res response method
   * @param {number} status HTTP Status code
   * @param {Record<string, any>} data Response data
   * @param {ResponseOptions} Options Response options
   * @returns {void}
   */
  protected Response(
    res: Response,
    status: number,
    data?: Record<string, any>,
    options: ResponseOptions = {},
  ): void {
    options = Object.assign({}, optionsDefault, options);
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

  protected error = error;
  protected assets = assets;
  protected router: Router = Router();
  protected auth = auth;
}
