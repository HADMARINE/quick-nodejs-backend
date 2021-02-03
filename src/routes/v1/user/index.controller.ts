import C from '@lib/blueprint/Controller';
import User from '@models/User';
import Auth from '@util/Auth';
import Assets from '@util/Assets';

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
    const { userid, password } = req.verify.body({
      userid: 'string',
      password: 'string',
    });

    const hashResult = Auth.password.create(password);

    const user = await User.create([
      {
        userid,
        ...hashResult,
      },
    ]);
    res.strict(201, user, { message: 'Created user successfully.' });
  });

  private updateUser = C.Wrapper(async (req, res) => {
    const { password } = req.verify.body({
      password: 'string-nullable',
    });

    const hashResult = password ? Auth.password.create(password) : null;
    const user = await User.findByIdAndUpdate(req.body.userData._id, {
      $set: Assets.updateQueryBuilder({ ...hashResult }),
    })
      .select('userid authority')
      .exec();
    if (!user) throw C.error.db.notfound();
    res.strict(200, user, { message: 'User data update successful' });
  });

  private getUser = C.Wrapper(async (req, res) => {
    const { userData } = req.body;
    const user = await User.findById(userData._id, 'userid authority').exec();
    if (!user) throw C.error.db.notfound();
    res.strict(200, user, { message: 'Data found' });
  });

  private deleteUser = C.Wrapper(async (req, res) => {
    const { userData } = req.body;
    const user = await User.findByIdAndDelete(userData._id, {})
      .select('userid authority')
      .exec();
    if (!user) throw C.error.db.notfound();
    res.strict(200, user, { message: 'User removal successful' });
  });
}
