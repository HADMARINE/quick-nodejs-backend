import { Request, Response } from 'express';
import Controller from '@lib/blueprint/Controller';

export default new (class Index extends Controller {
  public returnError = super.Wrapper((req, res) => {});

  public getIndex = super.Wrapper((req, res) => {
    super.Response(
      res,
      200,
      { status: 'alive', mode: 'development' },
      { message: 'Welcome to V1 API' },
    );
  });
})();
