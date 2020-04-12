import { Request, Response } from 'express';
import Controller from '@lib/blueprint/Controller';

export default new (class Hello extends Controller {
  public returnWorld(req: Request, res: Response) {
    super.Response(res, 200, { message: 'World' });
  }

  public returnError = super.Wrapper((req, res) => {
    throw this.error.db.create();
  });
})();
