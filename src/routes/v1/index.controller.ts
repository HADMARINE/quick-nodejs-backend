import { Request, Response } from 'express';
import Controller from '@lib/blueprint/Controller';

export default new (class extends Controller {
  public getIndex = super.Wrapper((req, res) => {
    super.Response(
      res,
      200,
      { status: 'alive', mode: process.env.NODE_ENV || 'development' },
      { message: 'Welcome to V1 API' },
    );
  });
})();
