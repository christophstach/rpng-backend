import { SchemaOptions } from 'mongoose';

export abstract class BaseModel {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const schemaOptions: SchemaOptions = {
  toJSON: {
    virtuals: true,
    getters: true,
  },
};