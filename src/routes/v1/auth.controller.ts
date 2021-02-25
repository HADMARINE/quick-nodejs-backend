import { InitialTokenCreateResult } from '@util/Auth';
import AuthRepository from '@src/repository/AuthRepository';
import {
  Controller,
  PostMapping,
  SetMiddleware,
  SetSuccessMessage,
  DataTypes,
  WrappedRequest,
} from 'express-quick-builder';
import { RateLimiter } from '@util/Middleware';

interface AuthControllerInterface {
  signIn(req: WrappedRequest): Promise<InitialTokenCreateResult | null>;

  resign(req: WrappedRequest): Promise<string | null>;
}

const authRepository = new AuthRepository();

@Controller
export default class AuthController implements AuthControllerInterface {
  @PostMapping()
  @SetMiddleware(RateLimiter(1, 5))
  @SetSuccessMessage('Login success')
  async signIn(req: WrappedRequest): Promise<InitialTokenCreateResult | null> {
    const { userid, password } = req.verify.body({
      userid: DataTypes.string,
      password: DataTypes.string,
    });

    return authRepository.signInitial({ userid, password });
  }

  @PostMapping('/resign')
  @SetMiddleware(RateLimiter(1, 10))
  @SetSuccessMessage('Successfully renewed access token')
  async resign(req: WrappedRequest): Promise<string | null> {
    const { token } = req.verify.body({
      token: DataTypes.string,
    });

    return authRepository.renewToken({ token });
  }
}
