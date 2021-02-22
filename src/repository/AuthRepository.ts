import Auth, { InitialTokenCreateResult } from '@util/Auth';
import Assets from '@util/Assets';
import error from '@error/ErrorDictionary';
import User from '@models/User';

interface AuthRepositoryInterface {
  signInitial(data: {
    userid: string;
    password: string;
  }): Promise<InitialTokenCreateResult | null>;
  renewToken(data: { token: string }): Promise<string | null>;

  // getRefreshToken(data:{
  //   user: string[] |
  // })
}

export default class AuthRepository implements AuthRepositoryInterface {
  async signInitial(data: {
    userid: string;
    password: string;
  }): Promise<InitialTokenCreateResult | null> {
    const startTime = Date.now();

    const user = await User.findOne({ userid: data.userid }).exec();

    if (!user) {
      await Assets.delayExact(startTime);
      throw error.auth.fail();
    }

    if (!Auth.password.verify(data.password, user.password, user.enckey)) {
      await Assets.delayExact(startTime);
      throw error.auth.fail();
    }
    return await Auth.token.create.initial({
      _id: user._id,
      userid: user.userid,
    });
  }

  async renewToken(data: { token: string }): Promise<string | null> {
    const tokenValue = await Auth.token.verify.refresh(data.token);
    return await Auth.token.create.manual(
      {
        _id: tokenValue._id,
        userid: tokenValue.userid,
      },
      'access',
    );
  }
}
