import { Role } from 'src/modules/users/entities/user.entity';

export interface AuthUser {
  sub: string; // user id
  email: string;
  role: Role;
  companyId: string;
}
