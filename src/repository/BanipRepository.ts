import Banip, { BanipDocument, BanipInterface } from '@models/Banip';
import { QueryBuilder } from '@util/Assets';

export default class BanipRepository {
  async create(data: BanipInterface): Promise<BanipDocument> {
    const banIp = await Banip.create(data);
    return banIp;
  }

  async findByIp(data: { ip: string }): Promise<BanipDocument | null> {
    return await Banip.findOne(data).exec();
  }

  async findByDocId(_id: string): Promise<BanipDocument | null> {
    return await Banip.findById(_id).exec();
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
      QueryBuilder({
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
      QueryBuilder({ ip: { $in: data.ip }, due: data.due }),
    );
    if (data.ip && data.ip.length > (banip.deletedCount || 0)) {
      return banip.deletedCount;
    }
    return banip.deletedCount;
  }
}
