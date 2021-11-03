import { model, Schema, Document, models } from 'mongoose';
import error from '@error/ErrorDictionary';
import { UserDocument } from './User';

export interface BanipInterface {
  ip: string;
  reason: string;
  due: number;
}

const BanipSchema: Schema = new Schema({
  ip: { type: String, required: true },
  reason: { type: String, required: true },
  due: { type: Number, required: true },
});

export interface BanipDocument extends Document, BanipInterface {
  // Add Methods here
}

// BanipSchema.methods.~~

BanipSchema.pre('save', function (next) {
  const doc = this as BanipDocument;
  models.Banip.findOne({ ip: doc.ip }, (err: any, user: UserDocument) => {
    if (user) next(error.db.exists() as any);
    if (err) next(err);
    next();
  });
});

const Banip = model<BanipDocument>('Banip', BanipSchema);

export default Banip;
