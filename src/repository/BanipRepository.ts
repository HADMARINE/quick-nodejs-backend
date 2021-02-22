import Banip, { BanipDocument, BanipInterface } from '@models/Banip';
import { UpdateQueryBuilder } from '@util/Assets';

interface BanipRepositoryInterface {
  create(data: BanipInterface): Promise<BanipDocument>;

  findByDocId(data: { _id: string }): Promise<BanipDocument | null>;

  findByIp(data: { ip: string }): Promise<BanipDocument | null>;

  findMany(
    data: Nullish<{
      query: Nullish<{
        ip: string[];
        due_from: number;
        due_to: number;
        reason: string;
      }>;
      skip: number | null;
      limit: number | null;
    }>,
  ): Promise<BanipDocument[] | null>;

  deleteMany(
    data: Nullish<{ ip: string[]; due: number }>,
  ): Promise<void | number | null>;
}

export default class BanipRepository implements BanipRepositoryInterface {
  async create(data: BanipInterface): Promise<BanipDocument> {
    const banIp = await Banip.create(data);
    return banIp;
  }

  async findByIp(data: { ip: string }): Promise<BanipDocument | null> {
    return await Banip.findOne(data).exec();
  }

  async findByDocId(data: { _id: string }): Promise<BanipDocument | null> {
    return await Banip.findById(data._id).exec();
  }

  async findMany(
    data: Nullish<{
      query: Nullish<{
        ip: string[];
        due_from: number;
        due_to: number;
        reason: string;
      }>;
      skip: number | null;
      limit: number | null;
    }>,
  ): Promise<BanipDocument[] | null> {
    const banip = await Banip.find(
      UpdateQueryBuilder({
        ip: { $in: data?.query?.ip },
        due: { $gte: data?.query?.due_from, $lte: data?.query?.due_to },
      }),
    )
      .skip(data.skip || 0)
      .limit(data.limit || 10);

    return banip.length !== 0 ? banip : null;
  }

  async deleteMany(
    data: Nullish<{
      ip: string[];
      due: number;
    }>,
  ): Promise<void | number | null> {
    const banip = await Banip.deleteMany(
      UpdateQueryBuilder({ ip: { $in: data.ip }, due: data.due }),
    );
    if (data.ip && data.ip.length > banip.n) {
      return banip.n;
    }
    return banip;
  }
}
