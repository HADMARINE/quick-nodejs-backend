// import Assets from '@util/Assets';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { codeData, defaultCode, defaultMessage } from '@lib/httpCode';
import {
  verificationWrapper,
  ProcessorType,
  RecursiveVerifiedTypes,
  PureProcessorType,
} from './DataVerify';
import Assets from './Assets';

export type WrappedRequest = {
  verify: {
    body<T>(
      processors: T extends Record<string, ProcessorType | PureProcessorType>
        ? T
        : any,
    ): RecursiveVerifiedTypes<T>;
    headers<T>(
      processors: T extends Record<string, ProcessorType | PureProcessorType>
        ? T
        : any,
    ): RecursiveVerifiedTypes<T>;
    cookies<T>(
      processors: T extends Record<string, ProcessorType | PureProcessorType>
        ? T
        : any,
    ): RecursiveVerifiedTypes<T>;
    signedCookies<T>(
      processors: T extends Record<string, ProcessorType | PureProcessorType>
        ? T
        : any,
    ): RecursiveVerifiedTypes<T>;
    query<T>(
      processors: T extends Record<string, ProcessorType | PureProcessorType>
        ? T
        : any,
    ): RecursiveVerifiedTypes<T>;
    params<T>(
      processors: T extends Record<string, ProcessorType | PureProcessorType>
        ? T
        : any,
    ): RecursiveVerifiedTypes<T>;
  };
} & Request;

export type WrappedResponse = {
  strict: (
    status: keyof typeof codeData,
    data?: any,
    options?: ResponseOptions,
  ) => void;
} & Response;

export interface ResponseOptions {
  result?: boolean;
  message?: string | null;
  code?: string | null;
  additionalData?: Record<string, any> | null;
}

export type WrappedRequestHandler = (
  req: WrappedRequest,
  res: WrappedResponse,
  next?: NextFunction,
) => void;

const optionsDefault = {
  result: true,
  message: null,
  code: null,
  additionalData: {},
};

export function RequestFactory(req: Request): WrappedRequest {
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
      body: verificationWrapper(req.body),
      headers: verificationWrapper(req.headers),
      cookies: verificationWrapper(req.cookies),
      signedCookies: verificationWrapper(req.signedCookies),
      query: verificationWrapper(req.query),
      params: verificationWrapper(req.params),
    },
  };

  return request;
}

/**
 * @description Stricts response rule
 * @param {Response} res response method
 * @param {number} status HTTP Status code
 * @param {Record<string, any>} data Response data
 * @param {ResponseOptions} Options Response options
 * @returns {void}
 */
export function ResponseFactory(res: Response): WrappedResponse {
  function strict(
    status: keyof typeof codeData,
    data?: any,
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

/**
 * @description To resolve Error and to reduce try-catch
 * @param {RequestHandler} requestHandler Request handler
 * @returns {RequestHandler} Returns request handler
 */
export const Wrapper = (
  requestHandler: WrappedRequestHandler,
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(
      requestHandler(RequestFactory(req), ResponseFactory(res), next),
    ).catch((e) => {
      next(e);
    });
  };
};

export const RawWrapper = (requestHandler: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(requestHandler(req, res, next)).catch((e) => {
      next(e);
    });
  };
};

export function Delayer(delay: number) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    return Promise.resolve(Assets.delayExact(Date.now(), delay)).then(
      (): void => {
        next();
      },
    );
  };
}
