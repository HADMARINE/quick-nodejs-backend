import Auth, { InitialTokenCreateResult } from '@util/Auth';
import Assets, { QueryBuilder } from '@util/Assets';
import error from '@error/ErrorDictionary';
import User from '@models/User';
import Session, { SessionDocument } from '@models/Session';

export default class AuthRepository {
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

  async findRefreshToken(
    data: PartialNullish<{
      user: string;
      jwtid: string;
      time: PartialNullish<{
        from: number;
        to: number;
      }>;
      skip: number;
      limit: number;
    }>,
  ): Promise<SessionDocument[] | null> {
    const token = await Session.find(
      QueryBuilder({
        user: data.user,
        jwtid: data.jwtid,
        expire: { $gt: data.time?.from, $lt: data.time?.to },
      }),
    )
      .skip(data.skip || 0)
      .limit(data.limit || 10)
      .exec();
    return token.length === 0 ? null : token;
  }

  async deleteRefreshToken(
    data: PartialNullish<{
      user: string;
      jwtid: string;
      time: PartialNullish<{
        from: number;
        to: number;
      }>;
    }>,
  ): Promise<void | null> {
    const token = await Session.deleteMany(
      QueryBuilder({
        user: data.user,
        jwtid: data.jwtid,
        expire: { $gt: data.time?.from, $lt: data.time?.to },
      }),
    );
  }
}
