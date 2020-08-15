import C from '@lib/blueprint/Controller';
import Session from '@models/Session';

export default class extends C {
  constructor() {
    super();
    this.router.get('/', C.auth.authority.admin, this.getToken);
    this.router.delete('/', C.auth.authority.admin, this.deleteToken);
  }

  private getToken = C.Wrapper(async (req, res) => {
    let query = {};
    const { user, jwtid, skip, limit } = req.query;
    const { time } = req.query as any;
    if (time) {
      query = Object.assign({}, query, {
        expire: { $lt: time.end, $gt: time.start },
      });
    }
    if (user) {
      query = Object.assign({}, query, { user: { $in: user } });
    }
    if (jwtid) {
      query = Object.assign({}, query, { jwtid });
    }
    const session = await Session.find(query)
      .skip(parseInt(C.assets.data.filter(skip, 'string'), 10))
      .limit(parseInt(C.assets.data.filter(limit, 'string'), 10))
      .exec();
    if (!session.length) throw C.error.db.notfound();
    res(200, session, {
      message: 'Found sessions',
    });
  });

  private deleteToken = C.Wrapper(async (req, res) => {
    let query = {};
    const { user, jwtid, unsafe } = req.query;
    const { time } = req.query as any;
    if (time) {
      query = Object.assign({}, query, {
        expire: { $lt: time.end, $gt: time.start },
      });
    }
    if (user) {
      query = Object.assign({}, query, { user: { $in: user } });
    }
    if (jwtid) {
      query = Object.assign({}, query, { jwtid });
    }
    if (unsafe !== 'true' && JSON.stringify(query) === '{}') {
      throw C.error.action.unsafe();
    }
    const session = await Session.deleteMany(query).exec();
    if (!session.deletedCount) throw C.error.db.notfound();
    res(
      200,
      { amount: session.deletedCount },
      {
        message: `Disabled ${session.deletedCount} token session matches.`,
      },
    );
  });
}
