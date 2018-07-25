import { BaseModel } from '../../shared/base.model';

export enum UserRole {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export class User extends BaseModel {
  username: string;
  email: string;
  password: string;
  roles?: UserRole[];
  firstName?: string;
  lastName?: string;
  verified: boolean;
}