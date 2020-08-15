import { Request, Response } from 'express';
import C from '@lib/blueprint/Controller';
import User from '@models/User';

export default class extends C {
  constructor() {
    super();
    this.router.get(
      '/',
      C.assets.apiRateLimiter(1, 10),
      C.auth.authority.user,
      this.getUser,
    );
    this.router.post('/', C.assets.apiRateLimiter(5, 5), this.createUser);
    this.router.patch(
      '/',
      C.assets.apiRateLimiter(1, 10),
      C.auth.authority.user,
      this.updateUser,
    );
    this.router.delete(
      '/',
      C.assets.apiRateLimiter(1, 10),
      C.auth.authority.user,
      this.deleteUser,
    );
  }

  private createUser = C.Wrapper(async (req, res) => {
    const { userid, password } = req.body;
    C.assets.checkNull(userid, password);
    const hashResult = C.auth.password.create(password);
    const user = await User.create([
      {
        userid,
        ...hashResult,
      },
    ]);
    res(201, user, { message: 'Created user successfully.' });
  });

  private updateUser = C.Wrapper(async (req, res) => {
    const { password } = req.body;

    const hashResult = password ? C.auth.password.create(password) : null;
    const user = await User.findByIdAndUpdate(req.body.userData._id, {
      $set: { ...hashResult },
    })
      .select('userid authority')
      .exec();
    if (!user) throw C.error.db.notfound();
    res(200, user, { message: 'User data update successful' });
  });

  private getUser = C.Wrapper(async (req, res) => {
    const { userData } = req.body;
    const user = await User.findById(userData._id, 'userid authority').exec();
    if (!user) throw C.error.db.notfound();
    res(200, user, { message: 'Data found' });
  });

  private deleteUser = C.Wrapper(async (req, res) => {
    const { userData } = req.body;
    const user = await User.findByIdAndDelete(userData._id, {})
      .select('userid authority')
      .exec();
    if (!user) throw C.error.db.notfound();
    res(200, user, { message: 'User removal successful' });
  });
}
