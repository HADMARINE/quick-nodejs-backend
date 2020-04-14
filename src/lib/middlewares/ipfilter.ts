import { IpFilter } from 'express-ipfilter';
import Banip from '@models/Banip';
import { Response, Request, NextFunction } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
  const banips = await Banip.find({})
    .or([{ due: { $gt: Date.now() } }, { due: { $lt: 0 } }])
    .exec();
  const ips = banips.map((value: Record<string, any>) => {
    return value.ip;
  });
  return IpFilter(ips, { logLevel: 'deny' })(req, res, next);
};
