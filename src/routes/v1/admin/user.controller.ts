import C from '@lib/blueprint/Controller';
import User from '@models/User';

export default class extends C {
  constructor() {
    super();
    this.router.get('/', C.auth.authority.admin, this.getUserMany);
    this.router.get('/:userid', C.auth.authority.admin, this.getUser);
    this.router.patch(
      '/authority',
      C.auth.authority.admin,
      this.setUserAuthority,
    );
    this.router.delete('/', C.auth.authority.admin, this.deleteUser);
  }

  private getUser = C.Wrapper(async (req, res) => {
    const { userid } = req.params;
    C.assets.checkNull(userid);
    const user = await User.findOne({ userid }).exec();
    if (!user) throw C.error.db.notfound();
    res(200, user, { message: `User found` });
  });

  private getUserMany = C.Wrapper(async (req, res) => {
    const { skip, limit } = req.query;
    const user = await User.find()
      .select('userid authority')
      .skip(parseInt(C.assets.data.filter(skip, 'string'), 10))
      .limit(parseInt(C.assets.data.filter(limit, 'string'), 10))
      .sort('-id')
      .exec();
    if (!user) throw C.error.db.notfound();
    res(200, user, { message: `User found` });
  });

  private deleteUser = C.Wrapper(async (req, res) => {
    let { userid } = req.body;
    C.assets.checkNull(userid);
    userid = C.assets.returnArray(userid);
    const user = await User.deleteMany({
      userid: { $in: userid },
    }).exec();
    if (!user.n) throw C.error.db.notfound();
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

  private setUserAuthority = C.Wrapper(async (req, res) => {
    const { authority } = req.body;
    let { userid } = req.body;
    userid = C.assets.returnArray(userid);
    C.assets.checkNull(userid, authority);
    const user = await User.updateMany(
      { userid: { $in: userid } },
      { $set: { authority } },
    ).exec();
    if (!user.n) throw C.error.db.notfound();
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
}
