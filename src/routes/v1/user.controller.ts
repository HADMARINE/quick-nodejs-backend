import { UserDocument } from '@models/User';
import Auth from '@util/Auth';
import {
  Controller,
  DeleteMapping,
  GetMapping,
  SetMiddleware,
  PatchMapping,
  PostMapping,
  SetSuccessMessage,
} from '@util/RestDecorator';
import { WrappedRequest } from '@util/ControllerUtil';
import UserRepository from '@repo/UserRepository';
import { AdminAuthority, RateLimiter, UserAuthority } from '@util/Middleware';
import { DataTypes } from '@util/DataVerify';

interface UserControllerInterface {
  create(req: WrappedRequest): Promise<void>;

  read(req: WrappedRequest): Promise<UserDocument | null>;

  update(req: WrappedRequest): Promise<UserDocument | null>;

  delete(req: WrappedRequest): Promise<null | void>;

  verifyAdmin(): void;

  verifyUser(): void;
}

const userRepository = new UserRepository();

@Controller
export default class UserController implements UserControllerInterface {
  @PostMapping()
  @SetMiddleware(RateLimiter(5, 5))
  @SetSuccessMessage('User created successfully')
  async create(req: WrappedRequest): Promise<void> {
    const { userid, password } = req.verify.body({
      userid: DataTypes.string,
      password: DataTypes.string,
    });

    return await userRepository.create({ userid, password });
  }

  @GetMapping()
  @SetMiddleware(RateLimiter(1, 10))
  @SetMiddleware(UserAuthority)
  @SetSuccessMessage('User data found')
  async read(req: WrappedRequest): Promise<UserDocument | null> {
    const { userData } = req.verify.body({ userData: DataTypes.object });

    return userRepository.findByDocId(userData._id);
  }

  @PatchMapping()
  @SetMiddleware(RateLimiter(1, 10))
  @SetMiddleware(UserAuthority)
  @SetSuccessMessage('User data updated')
  async update(req: WrappedRequest): Promise<UserDocument | null> {
    const { password, userData } = req.verify.body({
      password: DataTypes.stringNull,
      userData: DataTypes.object,
    });

    return userRepository.updateByDocId(userData._id, { password });
  }

  @DeleteMapping()
  @SetMiddleware(RateLimiter(1, 10))
  @SetMiddleware(Auth.authority.user)
  @SetSuccessMessage('User deleted successfully')
  async delete(req: WrappedRequest): Promise<null | void> {
    const { userData } = req.verify.body({
      userData: DataTypes.object,
    });

    return userRepository.deleteByDocId(userData._id);
  }

  @GetMapping('/test/admin')
  @SetMiddleware(RateLimiter(1, 20))
  @SetMiddleware(AdminAuthority)
  @SetSuccessMessage('Admin verified')
  verifyAdmin(): void {
    return;
  }

  @GetMapping('/test/user')
  @SetMiddleware(RateLimiter(1, 20))
  @SetMiddleware(UserAuthority)
  @SetSuccessMessage('User Verified')
  verifyUser(): void {
    return;
  }
}