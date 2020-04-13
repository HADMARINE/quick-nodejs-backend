import { Request, Response } from 'express';
import Controller from '@lib/blueprint/Controller';
import User from '@models/User';

export default new (class extends Controller {
  constructor() {
    super();
    this.router.post('/', this.createUser);
    this.router.patch('/', this.authorization.authority.user, this.updateUser);
  }

  private createUser = this.Wrapper(async (req, res) => {
    const { userid, password } = req.body;
    this.assets.checkNull([userid, password]);
    const hashResult = this.authorization.password.create(password);
    const user = await User.create({
      userid,
      password: hashResult.password,
      enckey: hashResult.enckey,
    });
    this.Response(
      res,
      201,
      { user },
      { message: 'Created user successfully.' },
    );
  });

  private updateUser = this.Wrapper(async (req, res) => {
    const { password } = req.body;
    this.assets.checkNull([password]);
    const hashResult = this.authorization.password.create(password);
    const user = await User.findByIdAndUpdate(req.body.userData._id, {
      $set: { password: hashResult.password, enckey: hashResult.enckey },
    }).exec();
    this.Response(
      res,
      202,
      { user },
      { message: 'Update user data successful' },
    );
  });
})();
