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
    const { skip, limit } = req.query;
    const banip = await Banip.find()
      .select('ip reason due')
      .skip(parseInt(C.assets.data.filter(skip, 'string') || 0, 10))
      .limit(parseInt(C.assets.data.filter(limit, 'string') || 10, 10))
      .sort('-id')
      .exec();
    if (!banip) throw C.error.db.notfound();
    res(200, { ...banip });
  });

  private getBannedIp = C.Wrapper(async (req, res) => {
    const { ip } = req.params;
    const banip = await Banip.findOne({ ip }).select('ip reason due').exec();
    if (!banip) throw C.error.db.notfound();
    res(200, banip);
  });

  private banIp = C.Wrapper(async (req, res) => {
    let { reason, due } = req.body;
    const { userData, ip } = req.body;
    C.assets.checkNull(ip);
    reason = reason
      ? `${reason} - ISSUED BY ADMIN(${userData.userid})`
      : `ISSUED BY ADMIN(${userData.userid})`;
    due = due ? due : -1;
    const banip = await Banip.create({ reason, due, ip });
    res(201, { banip }, { message: 'Successfully banned ip' });
  });

  private unbanIp = C.Wrapper(async (req, res) => {
    let { ip } = req.body;
    C.assets.checkNull(ip);
    ip = C.assets.returnArray(ip);
    const banip = await Banip.deleteMany({
      ip: { $in: ip },
    }).exec();
    if (!banip.n) throw C.error.db.notfound();
    if (ip.length > banip.n) {
      res(200, undefined, {
        message: 'Update successful, but could not found some datas.',
        code: 'PARTLY_SUCCESS',
      });
      return;
    }
    res(200, undefined, { message: 'Successfully debanned ip' });
  });
}
