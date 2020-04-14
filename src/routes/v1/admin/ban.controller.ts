import Controller from '@lib/blueprint/Controller';
import Banip from '@models/Banip';

export default new (class extends Controller {
  constructor() {
    super();
    this.router.post('/ip', this.auth.authority.admin, this.banIp);
    this.router.delete('/ip', this.auth.authority.admin, this.unbanIp);
  }

  private banIp = this.Wrapper(async (req, res) => {
    let { reason, due } = req.body;
    const { userData, ip } = req.body;
    this.assets.checkNull(ip);
    reason = reason
      ? `${reason} - ISSUED BY ADMIN(${userData.userid})`
      : `ISSUED BY ADMIN(${userData.userid})`;
    due = due ? due : -1;
    const bannedip = await Banip.create({ reason, due, ip });
    this.Response(
      res,
      201,
      { bannedip },
      { message: 'Successfully banned ip' },
    );
  });

  private unbanIp = this.Wrapper(async (req, res) => {
    const { ip } = req.body;
    this.assets.checkNull(ip);
    const unbannedip = await Banip.findOneAndDelete({ ip }).exec();
    this.Response(
      res,
      200,
      { unbannedip },
      { message: 'Successfully debanned ip' },
    );
  });
})();
