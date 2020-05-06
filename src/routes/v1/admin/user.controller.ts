import Controller from '@lib/blueprint/Controller';
import User from '@models/User';

export default new (class extends Controller {
  constructor() {
    super();
    this.router.get('/', this.auth.authority.admin, this.getUserMany);
    this.router.get('/:userid', this.auth.authority.admin, this.getUser);
    this.router.patch(
      '/authority',
      this.auth.authority.admin,
      this.setUserAuthority,
    );
    this.router.delete('/', this.auth.authority.admin, this.deleteUser);
  }

  private getUser = this.Wrapper(async (req, res) => {
    const { userid } = req.params;
    this.assets.checkNull(userid);
    const user = await User.findOne({ userid }).exec();
    if (!user) throw this.error.db.notfound();
    res(200, user, { message: `User found` });
  });

  private getUserMany = this.Wrapper(async (req, res) => {
    const { skip, limit } = req.query;
    const user = await User.find()
      .select('userid authority')
      .skip(parseInt(this.assets.data.filter(skip, 'string'), 10))
      .limit(parseInt(this.assets.data.filter(limit, 'string'), 10))
      .sort('-id')
      .exec();
    if (!user) throw this.error.db.notfound();
    res(200, user, { message: `User found` });
  });

  private deleteUser = this.Wrapper(async (req, res) => {
    let { userid } = req.body;
    this.assets.checkNull(userid);
    userid = this.assets.returnArray(userid);
    const user = await User.deleteMany({
      userid: { $in: userid },
    }).exec();
    if (!user.n) throw this.error.db.notfound();
    if (userid.length > user.n) {
      res(
        200,
        { successAmount: user.n },
        {
          message: 'Update successful, but could not found some datas.',
          code: 'PARTLY_SUCCESS',
        },
      );
      return;
    }
    res(200, undefined, { message: 'User delete successful' });
  });

  private setUserAuthority = this.Wrapper(async (req, res) => {
    const { authority } = req.body;
    let { userid } = req.body;
    userid = this.assets.returnArray(userid);
    this.assets.checkNull(userid, authority);
    const user = await User.updateMany(
      { userid: { $in: userid } },
      { $set: { authority } },
    ).exec();
    if (!user.n) throw this.error.db.notfound();
    if (userid.length > user.n) {
      res(200, undefined, {
        message: 'Update successful, but could not found some datas.',
        code: 'PARTLY_SUCCESS',
      });
      return;
    }
    res(200, undefined, {
      message: 'Update authority successful.',
    });
  });
})();
