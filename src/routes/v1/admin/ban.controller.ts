import ErrorDictionary from '@error/ErrorDictionary';
import { BanipDocument } from '@models/Banip';
import BanipRepository from '@repo/BanipRepository';
import { AdminAuthority } from '@util/Middleware';
import {
  Controller,
  DeleteMapping,
  GetMapping,
  PostMapping,
  SetMiddleware,
  SetSuccessMessage,
  WrappedRequest,
  DataTypes,
} from 'express-quick-builder';

interface AdminBanControllerInterface {
  create(req: WrappedRequest): Promise<BanipDocument | null>;
  readOne(req: WrappedRequest): Promise<BanipDocument | null>;
  readMany(req: WrappedRequest): Promise<BanipDocument[] | null>;
  delete(req: WrappedRequest): Promise<void | null>;
}

const banipRepository = new BanipRepository();

@Controller
export default class AdminBanController implements AdminBanControllerInterface {
  @PostMapping('/ip')
  @SetMiddleware(AdminAuthority)
  @SetSuccessMessage('Banned ip successfully.')
  async create(req: WrappedRequest): Promise<BanipDocument | null> {
    const { reason, due, ip, userData } = req.verify.body({
      reason: DataTypes.stringNull(),
      due: DataTypes.numberNull(),
      ip: DataTypes.string(),
      userData: DataTypes.object(),
    });

    return await banipRepository.create({
      ip,
      reason: reason
        ? `${reason} - ISSUED BY ADMIN(${userData.userid})`
        : `ISSUED BY ADMIN(${userData.userid})`,
      due: due ? due : -1,
    });
  }

  @GetMapping('/ip/:ip')
  @SetMiddleware(AdminAuthority)
  @SetSuccessMessage('Found banned ip')
  async readOne(req: WrappedRequest): Promise<BanipDocument | null> {
    const { ip } = req.verify.params({ ip: DataTypes.string() });
    return await banipRepository.findByIp({ ip });
  }

  @GetMapping('/ip')
  @SetMiddleware(AdminAuthority)
  @SetSuccessMessage('Found banned ips')
  async readMany(req: WrappedRequest): Promise<BanipDocument[] | null> {
    const { skip, limit, ip, due_from, due_to, reason } = req.verify.query({
      skip: DataTypes.numberNull(),
      limit: DataTypes.numberNull(),
      ip: DataTypes.arrayNull({ valueVerifier: DataTypes.string() }),
      due_from: DataTypes.numberNull(),
      due_to: DataTypes.numberNull(),
      reason: DataTypes.stringNull(),
    });

    return await banipRepository.findMany({
      skip,
      limit,
      query: {
        due_from,
        due_to,
        ip,
        reason,
      },
    });
  }

  @DeleteMapping('/ip')
  @SetMiddleware(AdminAuthority)
  @SetSuccessMessage('Unbanned ips successfully')
  async delete(req: WrappedRequest): Promise<void | null> {
    const { ip, due } = req.verify.body({
      ip: DataTypes.array({ valueVerifier: DataTypes.string() }),
      due: DataTypes.numberNull(),
    });

    const result = await banipRepository.deleteMany({ ip, due });
    if (DataTypes.number({ preciseTypeguard: true }).typeguard(result)) {
      throw ErrorDictionary.db.partial('delete', result);
    }
    return result;
  }
}
