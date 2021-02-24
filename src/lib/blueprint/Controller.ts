import { Router } from 'express';
import error from '@error/ErrorDictionary';
import assets from '@util/Assets';
import auth from '@util/Auth';
import aws from '@util/Aws';
import models from '@models/index';
import {
  Delayer,
  RawWrapper,
  RequestFactory,
  ResponseFactory,
  Wrapper,
} from '@util/ControllerUtil';

export default class Controller {
  static Wrapper = Wrapper;
  static RawWrapper = RawWrapper;
  static Delayer = Delayer;
  static Request = RequestFactory;
  static Response = ResponseFactory;

  protected readonly router = Router();

  static readonly error = error;
  static readonly assets = assets;
  static readonly auth = auth;
  static readonly models = models;
  static readonly aws = aws;
}
