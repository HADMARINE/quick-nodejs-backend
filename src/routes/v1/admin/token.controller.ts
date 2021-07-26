import { SessionDocument } from '@models/Session';
import AuthRepository from '@repo/AuthRepository';
import { Controller, WrappedRequest, DataTypes } from 'express-quick-builder';

interface TokenControllerInterface {
  readMany(req: WrappedRequest): Promise<SessionDocument[] | null>;
  deleteMany(req: WrappedRequest): Promise<void | null>;
}

const authRepository = new AuthRepository();
@Controller
export default class TokenController implements TokenControllerInterface {
  async readMany(req: WrappedRequest): Promise<SessionDocument[] | null> {
    const { user, jwtid, time_from, time_to, skip, limit } = req.verify.body({
      user: DataTypes.stringNull(),
      jwtid: DataTypes.stringNull(),
      time_from: DataTypes.numberNull(),
      time_to: DataTypes.numberNull(),
      skip: DataTypes.numberNull(),
      limit: DataTypes.numberNull(),
    });

    return await authRepository.findRefreshToken({
      user,
      jwtid,
      time: {
        from: time_from,
        to: time_to,
      },
      skip,
      limit,
    });
  }

  async deleteMany(req: WrappedRequest): Promise<void | null> {
    const { user, jwtid, time_from, time_to } = req.verify.body({
      user: DataTypes.stringNull(),
      jwtid: DataTypes.stringNull(),
      time_from: DataTypes.numberNull(),
      time_to: DataTypes.numberNull(),
    });

    return await authRepository.deleteRefreshToken({
      user,
      jwtid,
      time: { from: time_from, to: time_to },
    });
  }
}
