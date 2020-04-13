import Controller from '@lib/blueprint/Controller';
import User from '@models/User';
import { debugLogger } from '@lib/logger';

export default new (class extends Controller {
  constructor() {
    super();
    this.router.post('/', this.assets.apiRateLimiter(1, 5), this.signInUser);
    this.router.post(
      '/resign',
      this.assets.apiRateLimiter(1, 10),
      this.resignAccessToken,
    );
    this.router.get(
      '/test/admin',
      this.assets.apiRateLimiter(1, 20),
      this.authorization.authority.admin,
      this.checkUserLogin,
    );
    this.router.get(
      '/test/user',
      this.assets.apiRateLimiter(1, 20),
      this.authorization.authority.user,
      this.checkUserLogin,
    );
  }

  private signInUser = this.Wrapper(async (req, res) => {
    const startTime = Date.now();
    const { userid, password } = req.body;
    this.assets.checkNull([userid, password]);
    const user: any = await User.findOne({ userid }).exec();
    if (!user) {
      await this.assets.delayExact(startTime);
      throw this.error.authorization.fail();
    }
    if (
      !this.authorization.password.verify(password, user.password, user.enckey)
    ) {
      await this.assets.delayExact(startTime);
      throw this.error.authorization.fail();
    }
    const token = await this.authorization.token.create.initial({
      _id: user._id,
      userid: user.userid,
    });
    this.Response(res, 200, { token }, { message: 'Login successful' });
  });

  private resignAccessToken = this.Wrapper(async (req, res) => {
    const { token } = req.body;
    this.assets.checkNull([token]);
    const tokenValue = await this.authorization.token.verify.refresh(token);
    const renewToken = await this.authorization.token.create.manual(
      {
        _id: tokenValue._id,
        userid: tokenValue.userid,
      },
      'access',
    );
    this.Response(
      res,
      200,
      { token: renewToken },
      { message: 'Token creation successful' },
    );
  });

  private checkUserLogin = this.Wrapper((req, res) => {
    this.Response(res, 200);
  });
})();
