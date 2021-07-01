import { model, Schema, Document, HookNextFunction, models } from 'mongoose';
import error from '@error/ErrorDictionary';

export interface AnyInterface {
  // Add Schema here
}

const AnySchema: Schema = new Schema({
  // Configure Mongoose Schema here
});

export interface AnyDocument extends Document, AnyInterface {
  // Add Methods here
}

// AnySchema.methods.~~

AnySchema.pre('save', function (next: HookNextFunction): void {
  const doc = this as AnyDocument;
  models.Any.findOne(
    {
      $or: [],
    },
    function (err: Error, site: AnyDocument) {
      if (site) next(error.db.exists());
      if (err) next(err);
      next();
    },
  );
});

const Any = model<AnyDocument>('Any', AnySchema);

export default Any;
