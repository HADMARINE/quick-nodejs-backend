import { Request, Response } from 'express';
import Controller from '@lib/blueprint/Controller';

export default new (class extends Controller {
  constructor() {
    super();
    this.router.all('/', this.getIndex);
  }

  private getIndex = this.LegacyWrapper(async (req, res) => {
    this.Response(res)(
      200,
      { status: 'alive', mode: process.env.NODE_ENV || 'development' },
      { message: 'Welcome to V1 API' },
    );
  });
})();
