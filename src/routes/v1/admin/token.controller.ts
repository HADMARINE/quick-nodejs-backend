import C from '@lib/blueprint/Controller';
import Session from '@models/Session';
import Auth from '@util/Auth';

export default class extends C {
  constructor() {
    super();
    this.router.get('/', Auth.authority.admin, this.getToken);
    this.router.delete('/', Auth.authority.admin, this.deleteToken);
  }

  private getToken = C.Wrapper(async (req, res) => {
    let query = {};
    const { user, jwtid, time, skip, limit } = req.verify.query({
      user: 'string-nullable',
      jwtid: 'string-nullable',
      time: 'object-nullable',
      skip: 'number',
      limit: 'number',
    });

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

    const session = await Session.find(query).skip(skip).limit(limit).exec();
    if (!session.length) throw C.error.db.notfound();
    res.strict(200, session, {
      message: 'Found sessions',
    });
  });

  private deleteToken = C.Wrapper(async (req, res) => {
    let query = {};
    const { user, jwtid, unsafe } = req.verify.query({
      user: 'string-nullable',
      jwtid: 'string-nullable',
      unsafe: 'boolean-nullable',
    });
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
    if (unsafe !== true && JSON.stringify(query) === '{}') {
      throw C.error.action.unsafe();
    }
    const session = await Session.deleteMany(query).exec();
    if (!session.deletedCount) throw C.error.db.notfound();
    res.strict(
      200,
      { amount: session.deletedCount },
      {
        message: `Disabled ${session.deletedCount} token session matches.`,
      },
    );
  });
}
