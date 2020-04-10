import mongoose, { model, Schema, Document } from 'mongoose';
import Password from '@util/Password';

export interface UserInterface {
  userid: string;
  password: string;
  enckey: string;
}

const UserSchema = new Schema<UserInterface>({
  userid: { type: String, required: true },
  password: {
    type: String,
    required: true,
    set(value: string) {
      const result = Password.create(value);
      this.enckey = result.enckey;
    },
  },
  enckey: { type: String },
});

export interface UserDocument extends Document, UserInterface {
  // Add Methods here
}

// UserSchema.methods.~~

const UserModel = model<UserDocument>('User', UserSchema);

export default UserModel;
