import { UserRole } from '../../users/models/user.model';

export interface LoginTokenPayload {
  email: string;
  username: string;
  roles: UserRole[];
}