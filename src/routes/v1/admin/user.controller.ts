import { UserDocument } from '@models/User';
import {
  Controller,
  DeleteMapping,
  GetMapping,
  PatchMapping,
  SetMiddleware,
  WrappedRequest,
  DataTypes,
} from 'express-quick-builder';
import { AdminAuthority } from '@util/Middleware';
import UserRepository from '@repo/UserRepository';

interface AdminUserControllerInterface {
  readMany(req: WrappedRequest): Promise<UserDocument[] | null>;
  readOne(req: WrappedRequest): Promise<UserDocument | null>;
  update(req: WrappedRequest): Promise<UserDocument | null>;
  delete(req: WrappedRequest): Promise<void | null>;
}

const userRepository = new UserRepository();
@Controller
export default class AdminUserController
  implements AdminUserControllerInterface
{
  @GetMapping('/:userid')
  @SetMiddleware(AdminAuthority)
  async readOne(req: WrappedRequest): Promise<UserDocument | null> {
    const { userid } = req.verify.params({ userid: DataTypes.string() });
    return await userRepository.findById({ userid });
  }

  @GetMapping()
  @SetMiddleware(AdminAuthority)
  async readMany(req: WrappedRequest): Promise<UserDocument[] | null> {
    const { skip, limit, userid, _id, authority } = req.verify.query({
      skip: DataTypes.numberNull(),
      limit: DataTypes.numberNull(),
      userid: DataTypes.stringNull(),
      _id: DataTypes.stringNull(),
      authority: DataTypes.stringNull(),
    });
    return await userRepository.findMany({
      skip,
      limit,
      userid,
      _id,
      authority,
    });
  }

  @PatchMapping('/:docid')
  @SetMiddleware(AdminAuthority)
  async update(req: WrappedRequest): Promise<UserDocument | null> {
    const { docid } = req.verify.params({ docid: DataTypes.string() });
    const { userid, password, authority } = req.verify.body({
      userid: DataTypes.stringNull(),
      password: DataTypes.stringNull(),
      authority: DataTypes.stringNull(),
    });
    return userRepository.updateByDocId(docid, { userid, password, authority });
  }

  @DeleteMapping('/:docid')
  @SetMiddleware(AdminAuthority)
  async delete(req: WrappedRequest): Promise<void | null> {
    const { docid } = req.verify.params({ docid: DataTypes.string() });
    return userRepository.deleteByDocId(docid);
  }
}
