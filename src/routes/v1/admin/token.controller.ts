import C from '@lib/blueprint/Controller';
import Session from '@models/Session';
import Auth from '@util/Auth';
import Assets from '@util/Assets';
import { Schema } from 'mongoose';
import { DataTypes } from '@util/DataVerify';

export default class extends C {
  constructor() {
    super();
    this.router.get('/', Auth.authority.admin, this.getToken);
    this.router.delete('/', Auth.authority.admin, this.deleteToken);
  }

  private getToken = C.Wrapper(async (req, res) => {
    const { user, jwtid, time_from, time_to, skip, limit } = req.verify.query({
      user: 'array-nullable',
      jwtid: 'array-nullable',
      time_from: 'number-nullable',
      time_to: 'number-nullable',
      skip: 'number',
      limit: 'number',
    });

    const query = Assets.updateQueryBuilder({
      expire: { $gt: time_from, $lt: time_to },
      user: { $in: user },
      jwtid: { $in: jwtid },
    }) as {
      expire?: { $gt: number; $lt: number };
      user?: { $in: Schema.Types.ObjectId[] };
      jwtid?: { $in: string[] };
    };

    const session = await Session.find(query).skip(skip).limit(limit).exec();
    if (!session.length) throw C.error.db.notfound();
    res.strict(200, session, {
      message: 'Found sessions',
    });
  });

  private deleteToken = C.Wrapper(async (req, res) => {
    const { user, jwtid, unsafe, time_from, time_to } = req.verify.query({
      user: 'array-nullable',
      jwtid: 'string-nullable',
      unsafe: 'boolean',
      time_from: 'number-nullable',
      time_to: 'number-nullable',
    });

    const query = Assets.updateQueryBuilder({
      expire: { $gt: time_from, $lt: time_to },
      user: { $in: user },
      jwtid,
    });

    if (unsafe !== true) {
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
