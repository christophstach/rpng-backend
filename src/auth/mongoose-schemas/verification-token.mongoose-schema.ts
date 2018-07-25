import * as mongoose from 'mongoose';

export const VerificationTokenMongooseSchema = new mongoose.Schema({
  userId: { type: String, require: true, index: true, unique: true },
  token: { type: String, require: true, index: true, unique: true },
  expiresIn: { type: Date, require: true },
});