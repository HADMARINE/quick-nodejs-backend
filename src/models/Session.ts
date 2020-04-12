import mongoose, { model, Schema, Document, Model } from 'mongoose';
import Authorization from '@util/Authorization';
import error from '@error';

export interface SessionInterface {
  token: string;
  user: Schema.Types.ObjectId;
}

const SessionSchema: Schema = new Schema({
  token: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
});

export interface SessionDocument extends Document, SessionInterface {
  registerToken(token: string, _id: Schema.Types.ObjectId): Promise<void>;
}

SessionSchema.methods.registerToken = async function (
  token: string,
  _id: Schema.Types.ObjectId,
): Promise<void> {
  Authorization.token.verify(token);
  try {
    await SessionModel.create({ token, user: _id });
  } catch (e) {
    throw error.db.create('Session');
  }
};

const SessionModel = model<SessionDocument>('Session', SessionSchema);

export default SessionModel;
