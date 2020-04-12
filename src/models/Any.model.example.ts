import mongoose, { model, Schema, Document } from 'mongoose';

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

const AnyModel = model<AnyDocument>('Any', AnySchema);

export default AnyModel;
