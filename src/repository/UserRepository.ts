import User, { UserDocument } from '@models/User';
import Auth from '@util/Auth';
import Assets, { UpdateQueryBuilder } from '@util/Assets';
import { FilterQuery, Query } from 'mongoose';

interface UserRepositoryInterface {
  create(data: { userid: string; password: string }): Promise<void>;

  findByDocId(data: { _id: string }): Promise<UserDocument | null>;

  findById(data: { userid: string }): Promise<UserDocument | null>;

  findMany(data: {
    query?: FilterQuery<UserDocument> | null;
    skip?: number | null;
    limit?: number | null;
  }): Promise<UserDocument[] | null>;

  update(data: {
    _id: string;
    userid?: string | null;
    password: string | null;
  }): Promise<UserDocument | null>;

  deleteByDocId(data: { _id: string }): Promise<null | void>;

  deleteById(data: { userid: string }): Promise<null | void>;

  deleteByQuery(data: {
    query: FilterQuery<UserDocument>;
  }): Promise<null | void>;
}

export default class UserRepository implements UserRepositoryInterface {
  async create(data: { userid: string; password: string }): Promise<void> {
    const hashResult = Auth.password.create(data.password);

    User.find();

    const user = await User.create([
      {
        userid: data.userid,
        ...hashResult,
      },
    ]);
  }

  async findByDocId(data: { _id: string }): Promise<UserDocument | null> {
    return await User.findById(data._id, 'userid authority').exec();
  }

  async findById(data: { userid: string }): Promise<UserDocument | null> {
    return null;
  }

  async findMany(data: {
    query?: Record<string, any> | null;
    skip?: number | null;
    limit?: number | null;
  }): Promise<UserDocument[] | null> {
    return null;
  }

  async update(data: {
    _id: string;
    userid?: string | null;
    password?: string | null;
  }): Promise<UserDocument | null> {
    const hashResult = data.password
      ? Auth.password.create(data.password)
      : null;
    return await User.findByIdAndUpdate(data._id, {
      $set: UpdateQueryBuilder({ ...hashResult, userid: data.userid }),
    })
      .select('userid authority')
      .exec();
  }

  async deleteByDocId(data: { _id: string }): Promise<void | null> {
    const user = await User.findByIdAndDelete(data._id, {}).exec();
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
    const user: Query<any, UserDocument> = await User.deleteMany(
      Assets.updateQueryBuilder(data.query),
    ).exec();

    // user
    return null;
  }
}
