import mongoose, {
  model,
  Schema,
  Document,
  HookNextFunction,
  models,
} from 'mongoose';
import Password from '@util/Password';
import logger, { debugLogger } from '@lib/logger';
import error from '@error';

export interface UserInterface {
  userid: string;
  password: string;
  enckey: string;
}

const UserSchema = new Schema<UserDocument>({
  userid: { type: String, required: true, lowercase: true },
  password: {
    type: String,
    required: true,
    set(value: string) {
      const doc = this as UserDocument;
      const result = Password.create(value);
      doc.enckey = result.enckey;
      return result.password;
    },
  },
  enckey: { type: String },
});

export interface UserDocument extends Document, UserInterface {
  // Add Methods here
}

// UserSchema.methods.~~

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
