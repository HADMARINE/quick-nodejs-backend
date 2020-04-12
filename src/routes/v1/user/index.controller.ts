import { Request, Response } from 'express';
import Controller from '@lib/blueprint/Controller';
import User from '@models/User';

export default new (class extends Controller {
  constructor() {
    super();
    this.router.post('/', this.createUser);
  }

  private createUser = this.Wrapper(async (req, res) => {
    const { userid, password } = req.body;
    this.assets.checkNull([userid, password]);
    const user = await User.create({ userid, password });
    this.Response(
      res,
      201,
      { user },
      { message: 'Created user successfully.' },
    );
  });
})();
