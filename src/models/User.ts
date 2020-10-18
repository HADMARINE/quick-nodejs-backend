import { model, Schema, Document, HookNextFunction, models } from 'mongoose';
import error from '@error';

export interface UserInterface {
  userid: string;
  password: string;
  enckey: string;
  authority?: string;
}

const UserSchema = new Schema<UserDocument>({
  userid: { type: String, required: true, lowercase: true },
  password: { type: String, required: true },
  enckey: { type: String, required: true },
  authority: { type: String, default: 'normal' },
});

export interface UserDocument extends Document, UserInterface {
  checkUserExists(userid: string): Promise<boolean>;
}

UserSchema.methods.checkUserExists = async function (userid) {
  if (await models.User.findOne({ userid }).exec()) return true;
  return false;
};

UserSchema.pre('save', function (next: HookNextFunction) {
  const doc = this as UserDocument;
  models.User.findOne({ userid: doc.userid }, function (err, user) {
    if (user) next(error.db.exists() as any);
    if (err) next(err);
    next();
  });
});

const User = model<UserDocument>('User', UserSchema);

export default User;
