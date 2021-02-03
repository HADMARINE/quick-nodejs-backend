import C from '@lib/blueprint/Controller';
import Banip from '@models/Banip';

export default class extends C {
  constructor() {
    super();
    this.router.get(`/ip`, C.auth.authority.admin, this.getBannedIpList);
    this.router.get(`/ip/:ip`, C.auth.authority.admin, this.getBannedIp);
    this.router.post('/ip', C.auth.authority.admin, this.banIp);
    this.router.delete('/ip', C.auth.authority.admin, this.unbanIp);
  }

  private getBannedIpList = C.Wrapper(async (req, res) => {
    const { skip, limit } = req.verify.query({
      skip: 'number',
      limit: 'number',
    });
    const banip = await Banip.find()
      .select('ip reason due')
      .skip(skip)
      .limit(limit)
      .sort('-id')
      .exec();
    if (!banip) throw C.error.db.notfound();
    res.strict(200, { ...banip });
  });

  private getBannedIp = C.Wrapper(async (req, res) => {
    const { ip } = req.verify.params({
      ip: 'string',
    });
    const banip = await Banip.findOne({ ip }).select('ip reason due').exec();
    if (!banip) throw C.error.db.notfound();
    res.strict(200, banip);
  });

  private banIp = C.Wrapper(async (req, res) => {
    let { reason, due, userData, ip } = req.verify.body({
      reason: 'string-nullable',
      due: 'number-nullable',
      userData: 'object-nullable',
      ip: 'string',
    });
    reason = reason
      ? `${reason} - ISSUED BY ADMIN(${userData.userid})`
      : `ISSUED BY ADMIN(${userData.userid})`;
    due = due ? due : -1;
    const banip = await Banip.create({ reason, due, ip });
    res.strict(201, { banip }, { message: 'Successfully banned ip' });
  });

  private unbanIp = C.Wrapper(async (req, res) => {
    const { ip } = req.verify.body({
      ip: 'array',
    });
    const banip = await Banip.deleteMany({
      ip: { $in: ip },
    }).exec();
    if (!banip.n) throw C.error.db.notfound();
    if (ip.length > banip.n) {
      res.strict(200, undefined, {
        message: 'Update successful, but could not found some datas.',
        code: 'PARTLY_SUCCESS',
      });
      return;
    }
    res.strict(200, undefined, { message: 'Successfully unbanned ip' });
  });
}
