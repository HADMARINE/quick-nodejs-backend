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
    const { userid } = req.verify.params({
      userid: 'string',
    });
    const user = await User.findOne({ userid }).exec();
    if (!user) throw C.error.db.notfound();
    res.strict(200, user, { message: `User found` });
  });

  private getUserMany = C.Wrapper(async (req, res) => {
    const { skip, limit } = req.verify.query({
      skip: 'number',
      limit: 'number',
    });
    const user = await User.find()
      .select('userid authority')
      .skip(skip)
      .limit(limit)
      .sort('-id')
      .exec();
    if (!user) throw C.error.db.notfound();
    res.strict(200, user, { message: `User found` });
  });

  private deleteUser = C.Wrapper(async (req, res) => {
    const { userid } = req.verify.body({
      userid: 'array',
    });
    const user = await User.deleteMany({
      userid: { $in: userid },
    }).exec();
    if (!user.n) throw C.error.db.notfound();
    if (userid.length > user.n) {
      res.strict(
        200,
        { successAmount: user.n },
        {
          message: 'Update successful, but could not found some datas.',
          code: 'PARTLY_SUCCESS',
        },
      );
      return;
    }
    res.strict(200, undefined, { message: 'User delete successful' });
  });

  private setUserAuthority = C.Wrapper(async (req, res) => {
    const { userid, authority } = req.verify.body({
      userid: 'array',
      authority: 'string',
    });
    const user = await User.updateMany(
      { userid: { $in: userid } },
      { $set: { authority } },
    ).exec();
    if (!user.n) throw C.error.db.notfound();
    if (userid.length > user.n) {
      res.strict(200, undefined, {
        message: 'Update successful, but could not found some datas.',
        code: 'PARTLY_SUCCESS',
      });
      return;
    }
    res.strict(200, undefined, {
      message: 'Update authority successful.',
    });
  });
}
