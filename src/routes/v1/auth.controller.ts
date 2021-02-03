import C from '@lib/blueprint/Controller';
import User from '@models/User';
import Assets from '@util/Assets';

export default class extends C {
  constructor() {
    super();
    this.router.post('/', C.assets.apiRateLimiter(1, 5), this.signInUser);
    this.router.post(
      '/resign',
      Assets.apiRateLimiter(1, 10),
      this.resignAccessToken,
    );
  }

  private signInUser = C.Wrapper(async (req, res) => {
    const startTime = Date.now();
    const { userid, password } = req.verify.body({
      userid: 'string',
      password: 'string',
    });

    const user: any = await User.findOne({ userid }).exec();

    if (!user) {
      await Assets.delayExact(startTime);
      throw C.error.auth.fail();
    }
    if (!C.auth.password.verify(password, user.password, user.enckey)) {
      await Assets.delayExact(startTime);
      throw C.error.auth.fail();
    }
    const token = await C.auth.token.create.initial({
      _id: user._id,
      userid: user.userid,
    });
    res.strict(200, { token }, { message: 'Login successful' });
  });

  private resignAccessToken = C.Wrapper(async (req, res) => {
    const { token } = req.verify.body({
      token: 'string',
    });
    const tokenValue = await C.auth.token.verify.refresh(token);
    const renewToken = await C.auth.token.create.manual(
      {
        _id: tokenValue._id,
        userid: tokenValue.userid,
      },
      'access',
    );
    res.strict(
      200,
      { token: renewToken },
      { message: 'Token creation successful' },
    );
  });
}
