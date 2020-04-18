import { Request, Response } from 'express';
import Controller from '@lib/blueprint/Controller';
import User from '@models/User';

export default new (class extends Controller {
  constructor() {
    super();
    this.router.get(
      '/',
      this.assets.apiRateLimiter(1, 10),
      this.auth.authority.user,
      this.getUser,
    );
    this.router.post('/', this.assets.apiRateLimiter(5, 5), this.createUser);
    this.router.patch(
      '/',
      this.assets.apiRateLimiter(1, 10),
      this.auth.authority.user,
      this.updateUser,
    );
    this.router.delete(
      '/',
      this.assets.apiRateLimiter(1, 10),
      this.auth.authority.user,
      this.deleteUser,
    );
  }

  private createUser = this.Wrapper(async (req, res) => {
    const { userid, password } = req.body;
    this.assets.checkNull(userid, password);
    const hashResult = this.auth.password.create(password);
    const user = await User.create([
      {
        userid,
        ...hashResult,
      },
    ]);
    res(201, user, { message: 'Created user successfully.' });
  });

  private updateUser = this.Wrapper(async (req, res) => {
    const { password } = req.body;

    const hashResult = password ? this.auth.password.create(password) : null;
    const user = await User.findByIdAndUpdate(req.body.userData._id, {
      $set: { ...hashResult },
    })
      .select('userid authority')
      .exec();
    if (!user) throw this.error.db.notfound();
    res(200, user, { message: 'User data update successful' });
  });

  private getUser = this.Wrapper(async (req, res) => {
    const { userData } = req.body;
    const user = await User.findById(userData._id, 'userid authority').exec();
    if (!user) throw this.error.db.notfound();
    res(200, user, { message: 'Data found' });
  });

  private deleteUser = this.Wrapper(async (req, res) => {
    const { userData } = req.body;
    const user = await User.findByIdAndDelete(userData._id, {})
      .select('userid authority')
      .exec();
    if (!user) throw this.error.db.notfound();
    res(200, user, { message: 'User removal successful' });
  });
})();
