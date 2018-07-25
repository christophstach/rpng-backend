import * as mongoose from 'mongoose';
import { UserRole } from '../models/user.model';
import { EnumHelper } from '../../shared/helpers/enum.helper';

export const UserMongooseSchema = new mongoose.Schema({
  username: { type: String, require: true, index: true, unique: true },
  email: { type: String, require: true, index: true, unique: true },
  password: { type: String, require: true },
  roles: { type: [String], enum: EnumHelper.values(UserRole) },
  firstName: { type: String },
  lastName: { type: String },
  verified: { type: Boolean, defaults: false },
});