import { BaseModel } from '../../shared/base.model';

export interface VerificationToken extends BaseModel {
  userId: string;
  token: string;
  expiresIn: Date;
}