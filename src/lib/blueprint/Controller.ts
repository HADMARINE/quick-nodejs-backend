import {
  Response,
  Request,
  NextFunction,
  RequestHandler,
  Router,
} from 'express';
import { defaultMessage, defaultCode, codeData } from '@lib/httpCode';
import error from '@error';
import assets, { VerifierWrapperInnerFunction } from '@util/Assets';
import auth from '@util/Auth';
import aws from '@util/Aws';
import models from '@models/index';

interface ResponseOptions {
  result?: boolean;
  message?: string | null;
  code?: string | null;
  additionalData?: Record<string, any> | null;
}

type CustomRequestProperties = {
  verify: {
    body: VerifierWrapperInnerFunction;
    headers: VerifierWrapperInnerFunction;
    cookies: VerifierWrapperInnerFunction;
    signedCookies: VerifierWrapperInnerFunction;
    query: VerifierWrapperInnerFunction;
    params: VerifierWrapperInnerFunction;
  };
} & Request;

type CustomResponseProperties = {
  strict: (
    status: keyof typeof codeData,
    data?: Record<string, any>,
    options?: ResponseOptions,
  ) => void;
} & Response;

type CustomRequestHandler = (
  req: CustomRequestProperties,
  res: CustomResponseProperties,
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
      Promise.resolve(
        requestHandler(this.Request(req), this.Response(res), next),
      ).catch((e) => {
        next(e);
      });
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
  static Response(res: Response): CustomResponseProperties {
    function strict(
      status: keyof typeof codeData,
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
    }

    const response = {
      ...res,
      assignSocket: res.assignSocket,
      detachSocket: res.detachSocket,
      writeContinue: res.writeContinue,
      writeHead: res.writeHead,
      writeProcessing: res.writeProcessing,
      setTimeout: res.setTimeout,
      setHeader: res.setHeader,
      getHeader: res.getHeader,
      getHeaders: res.getHeaders,
      getHeaderNames: res.getHeaderNames,
      hasHeader: res.hasHeader,
      removeHeader: res.removeHeader,
      addTrailers: res.addTrailers,
      flushHeaders: res.flushHeaders,
      _write: res._write,
      _destroy: res._destroy,
      _final: res._final,
      write: res.write,
      setDefaultEncoding: res.setDefaultEncoding,
      end: res.end,
      cork: res.cork,
      uncork: res.uncork,
      destroy: res.destroy,
      addListener: res.addListener,
      emit: res.emit,
      on: res.on,
      once: res.once,
      prependListener: res.prependListener,
      prependOnceListener: res.prependOnceListener,
      removeListener: res.removeListener,
      pipe: res.pipe,
      strict,
    };

    return response;
  }

  static Request(req: Request): CustomRequestProperties {
    const request = {
      ...req,
      setTimeout: req.setTimeout,
      destroy: req.destroy,
      _read: req._read,
      read: req.read,
      setEncoding: req.setEncoding,
      pause: req.pause,
      resume: req.resume,
      isPaused: req.isPaused,
      unpipe: req.unpipe,
      unshift: req.unshift,
      wrap: req.wrap,
      push: req.push,
      _destroy: req._destroy,
      addListener: req.addListener,
      emit: req.emit,
      on: req.on,
      once: req.once,
      prependListener: req.prependListener,
      prependOnceListener: req.prependOnceListener,
      removeListener: req.removeListener,
      pipe: req.pipe,
      [Symbol.asyncIterator]: req[Symbol.asyncIterator],
      verify: {
        body: assets.data.paramVerifier.wrapper(req.body),
        headers: assets.data.paramVerifier.wrapper(req.headers),
        cookies: assets.data.paramVerifier.wrapper(req.cookies),
        signedCookies: assets.data.paramVerifier.wrapper(req.signedCookies),
        query: assets.data.paramVerifier.wrapper(req.query),
        params: assets.data.paramVerifier.wrapper(req.params),
      },
    };

    return request;
  }

  public readonly router: Router = Router();

  static readonly error = error;
  static readonly assets = assets;
  static readonly auth = auth;
  static readonly models = models;
  static readonly aws = aws;
}
