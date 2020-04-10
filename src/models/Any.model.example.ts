import mongoose, { model, Schema, Document } from 'mongoose';

export interface AnyInterface {
  // Add Schema here
}

export interface AnyDocument extends Document, AnyInterface {
  // Add Methods here
}

const AnySchema: Schema = new Schema({
  // Configure Mongoose Schema here
});

// AnySchema.methods.~~

export default model<AnyDocument>('Any', AnySchema);
