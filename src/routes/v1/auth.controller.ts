import Controller from '@lib/blueprint/Controller';
import User from '@models/User';

export default new (class extends Controller {
  constructor() {
    super();
    this.router.post('/', this.assets.apiRateLimiter(1, 5), this.signInUser);
    this.router.post(
      '/resign',
      this.assets.apiRateLimiter(1, 10),
      this.resignAccessToken,
    );
  }

  private signInUser = this.Wrapper(async (req, res) => {
    const startTime = Date.now();
    const { userid, password } = req.body;
    this.assets.checkNull(userid, password);
    const user: any = await User.findOne({ userid }).exec();
    if (!user) {
      await this.assets.delayExact(startTime);
      throw this.error.auth.fail();
    }
    if (!this.auth.password.verify(password, user.password, user.enckey)) {
      await this.assets.delayExact(startTime);
      throw this.error.auth.fail();
    }
    const token = await this.auth.token.create.initial({
      _id: user._id,
      userid: user.userid,
    });
    res(200, { token }, { message: 'Login successful' });
  });

  private resignAccessToken = this.Wrapper(async (req, res) => {
    const { token } = req.body;
    this.assets.checkNull(token);
    const tokenValue = await this.auth.token.verify.refresh(token);
    const renewToken = await this.auth.token.create.manual(
      {
        _id: tokenValue._id,
        userid: tokenValue.userid,
      },
      'access',
    );
    res(200, { token: renewToken }, { message: 'Token creation successful' });
  });
})();
