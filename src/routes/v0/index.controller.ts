import { Request, Response } from 'express';
import Controller from '@lib/blueprint/Controller';

export default new (class extends Controller {
  constructor() {
    super();
    this.router.get('/', this.returnWorld);
    this.router.get('/errortest', this.returnError);
  }

  private returnWorld(req: Request, res: Response) {
    super.Response(res, 200, { message: 'World' });
  }

  private returnError = super.Wrapper((req, res) => {
    throw this.error.test();
  });
})();
