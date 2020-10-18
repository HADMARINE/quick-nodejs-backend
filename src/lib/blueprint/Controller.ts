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
import aws from '@util/Aws';
import models from '@models/index';

interface ResponseOptions {
  result?: boolean;
  message?: string | null;
  code?: string | null;
  additionalData?: Record<string, any> | null;
}

type CustomResponseFunction = (
  status: number,
  data?: Record<string, any>,
  options?: ResponseOptions,
) => void;

type CustomRequestHandler = (
  req: Request,
  res: CustomResponseFunction,
  next?: NextFunction,
) => void;

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
  static Wrapper(requestHandler: CustomRequestHandler): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
      Promise.resolve(requestHandler(req, this.Response(res), next)).catch(
        (e) => {
          next(e);
        },
      );
    };
  }

  static RawWrapper(requestHandler: RequestHandler): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
      Promise.resolve(requestHandler(req, res, next)).catch((e) => {
        next(e);
      });
    };
  }

  static Delayer(delay: number) {
    return async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      return Promise.resolve(
        Controller.assets.delayExact(Date.now(), delay),
      ).then((): void => {
        next();
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
  static Response(res: Response): CustomResponseFunction {
    return function (
      status: number,
      data?: Record<string, any> | string,
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
    };
  }

  public readonly router: Router = Router();

  static readonly error = error;
  static readonly assets = assets;
  static readonly auth = auth;
  static readonly models = models;
  static readonly aws = aws;
}
