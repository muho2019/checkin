import { Role } from '@users/entities/user.entity';

export interface AuthUser {
  sub: string; // user id
  email: string;
  role: Role;
  companyId: string;
  companyName: string;
}
