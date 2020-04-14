import Controller from '@lib/blueprint/Controller';
import Session from '@models/Session';

export default new (class extends Controller {
  constructor() {
    super();
    this.router.delete('/', this.auth.authority.admin, this.deleteToken);
    this.router.delete(
      '/user/:userid',
      this.auth.authority.admin,
      this.deleteTokenByUser,
    );
    this.router.delete('/all', this.auth.authority.admin, this.deleteTokenAll);
  }

  private deleteToken = this.Wrapper(async (req, res) => {
    let query = {};
    const { user, time } = req.body.query;
    if (time) {
      query = Object.assign({}, query, {
        expire: { $lt: time.end, $gt: time.start },
      });
    }
    if (user) {
      query = Object.assign({}, query, { user: { $in: user } });
    }
    await Session.find(query).exec();
    this.Response(res, 200, {}, { message: 'Disabled token session matches.' });
  });

  private deleteTokenByUser = this.Wrapper(async (req, res) => {
    const { userid } = req.params;
    await this.auth.token.detach.user(userid);
    this.Response(res, 200, {}, { message: `Detached Token ` });
  });

  private deleteTokenAll = this.Wrapper(async (req, res) => {
    await this.auth.token.detach.all();
    this.Response(res, 200, {}, { message: 'Disabled all token sessions.' });
  });
})();
