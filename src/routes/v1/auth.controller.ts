import C from '@lib/blueprint/Controller';
import User from '@models/User';

export default class extends C {
  constructor() {
    super();
    this.router.post('/', C.assets.apiRateLimiter(1, 5), this.signInUser);
    this.router.post(
      '/resign',
      C.assets.apiRateLimiter(1, 10),
      this.resignAccessToken,
    );
  }

  private signInUser = C.Wrapper(async (req, res) => {
    const startTime = Date.now();
    const { userid, password } = req.body;
    C.assets.checkNull(userid, password);
    const user: any = await User.findOne({ userid }).exec();
    if (!user) {
      await C.assets.delayExact(startTime);
      throw C.error.auth.fail();
    }
    if (!C.auth.password.verify(password, user.password, user.enckey)) {
      await C.assets.delayExact(startTime);
      throw C.error.auth.fail();
    }
    const token = await C.auth.token.create.initial({
      _id: user._id,
      userid: user.userid,
    });
    res(200, { token }, { message: 'Login successful' });
  });

  private resignAccessToken = C.Wrapper(async (req, res) => {
    const { token } = req.body;
    C.assets.checkNull(token);
    const tokenValue = await C.auth.token.verify.refresh(token);
    const renewToken = await C.auth.token.create.manual(
      {
        _id: tokenValue._id,
        userid: tokenValue.userid,
      },
      'access',
    );
    res(200, { token: renewToken }, { message: 'Token creation successful' });
  });
}
