import mongoose, {
  model,
  Schema,
  Document,
  HookNextFunction,
  models,
} from 'mongoose';
import Authorization from '@util/Authorization';
import logger, { debugLogger } from '@lib/logger';
import error from '@error';

export interface UserInterface {
  userid: string;
  password: string;
  enckey: string;
  authority: string;
}

const UserSchema = new Schema<UserDocument>({
  userid: { type: String, required: true, lowercase: true },
  password: {
    type: String,
    required: true,
    set(value: string) {
      const doc = this as UserDocument;
      const result = Authorization.password.create(value);
      doc.enckey = result.enckey;
      return result.password;
    },
  },
  enckey: { type: String },
  authority: { type: String, default: 'normal' },
});

export interface UserDocument extends Document, UserInterface {
  checkUserExists(userid: string): Promise<boolean>;
}

UserSchema.methods.checkUserExists = async function (userid) {
  if (await models['User'].findOne({ userid }).exec()) return true;
  return false;
};

UserSchema.pre('save', function (next: HookNextFunction) {
  const doc = this as UserDocument;
  models['User'].findOne({ userid: doc.userid }, function (err, user) {
    if (user) next(error.db.exists() as any);
    if (err) next(err);
    next();
  });
});

const UserModel = model<UserDocument>('User', UserSchema);

export default UserModel;
