import { model, Schema, Document } from 'mongoose';
import Auth from '@util/Auth';
import error from '@error/ErrorDictionary';
import jwt from 'jsonwebtoken';

export interface SessionInterface {
  jwtid: string;
  user: Schema.Types.ObjectId;
  expire: number;
}

const SessionSchema: Schema = new Schema({
  jwtid: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  expire: { type: Number, required: true },
});

export interface SessionDocument extends Document, SessionInterface {
  registerToken(token: string): Promise<void>;
}

SessionSchema.methods.registerToken = async function (
  token: string,
): Promise<void> {
  await Auth.token.verify.manual(token, 'refresh', true);
  try {
    const tokenValue: any = jwt.decode(token);
    if (!tokenValue.exp || !tokenValue.jti) {
      throw new Error();
    }
    await Session.create({
      jwtid: tokenValue.jti,
      user: (tokenValue.jti as string).split('_')[1],
      expire: tokenValue.exp,
    });
  } catch (e) {
    throw error.db.create('Session');
  }
};

const Session = model<SessionDocument>('Session', SessionSchema);

export default Session;
