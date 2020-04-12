import { Request, Response } from 'express';
import Controller from '@lib/blueprint/Controller';
import User from '@models/User';

export default new (class extends Controller {
  public getIndex = this.Wrapper(async (req, res) => {
    this.Response(
      res,
      200,
      { status: 'alive', mode: process.env.NODE_ENV || 'development' },
      { message: 'Welcome to V1 API' },
    );
  });

  public createUser = this.Wrapper(async (req, res) => {
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
