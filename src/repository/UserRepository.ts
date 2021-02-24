import User, { UserDocument } from '@models/User';
import Auth from '@util/Auth';
import Assets, { QueryBuilder } from '@util/Assets';
import { FilterQuery } from 'mongoose';

interface UserRepositoryInterface {
  create(data: { userid: string; password: string }): Promise<void>;

  findByDocId(_id: string): Promise<UserDocument | null>;

  findById(data: { userid: string }): Promise<UserDocument | null>;

  findMany(
    data: PartialNullish<{
      userid: string;
      _id: string;
      authority: string;
      skip: number;
      limit: number;
    }>,
  ): Promise<UserDocument[] | null>;

  updateByDocId(
    _id: string,
    data: PartialNullish<{
      userid: string;
      password: string;
      authority: string;
    }>,
  ): Promise<UserDocument | null>;

  deleteByDocId(_id: string): Promise<null | void>;

  deleteById(data: { userid: string }): Promise<null | void>;

  deleteByQuery(data: {
    query: FilterQuery<UserDocument>;
  }): Promise<null | void>;
}

export default class UserRepository implements UserRepositoryInterface {
  async create(data: { userid: string; password: string }): Promise<void> {
    const hashResult = Auth.password.create(data.password);

    await User.create([
      {
        userid: data.userid,
        ...hashResult,
      },
    ]);
  }

  async findByDocId(_id: string): Promise<UserDocument | null> {
    return await User.findById(_id, 'userid authority').exec();
  }

  async findById(data: { userid: string }): Promise<UserDocument | null> {
    return await User.findOne({ userid: data.userid }).exec();
  }

  async findMany(
    data: PartialNullish<{
      userid: string;
      _id: string;
      authority: string;
      skip: number;
      limit: number;
    }>,
  ): Promise<UserDocument[] | null> {
    const skip = data.skip;
    const limit = data.limit;
    data.skip = null;
    data.limit = null;
    const user = await User.find(QueryBuilder(data))
      .skip(skip || 0)
      .limit(limit || 10)
      .exec();
    return user.length === 0 ? null : user;
  }

  async updateByDocId(
    _id: string,
    data: PartialNullish<{
      userid: string;
      password: string;
      authority: string;
    }>,
  ): Promise<UserDocument | null> {
    const hashResult = data.password
      ? Auth.password.create(data.password)
      : null;
    return await User.findByIdAndUpdate(_id, {
      $set: QueryBuilder({
        ...hashResult,
        userid: data.userid,
        authority: data.authority,
      }),
    })
      .select('userid authority')
      .exec();
  }

  async deleteByDocId(_id: string): Promise<void | null> {
    const user = await User.findByIdAndDelete(_id, {}).exec();
    return user === null ? null : undefined;
  }

  async deleteById(data: { userid: string }): Promise<void | null> {
    const user = await User.findOneAndDelete(
      { userid: data.userid },
      {},
    ).exec();
    return user === null ? null : undefined;
  }

  async deleteByQuery(data: {
    query: FilterQuery<UserDocument>;
  }): Promise<void | null> {
    const user = await User.deleteMany(Assets.updateQueryBuilder(data.query));
    return user.n === 0 ? null : undefined;
  }
}
