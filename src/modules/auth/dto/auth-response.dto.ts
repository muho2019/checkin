import { Role } from '@users/entities/user.entity';

export class AuthResponseDto {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: Role;
    companyId: string;
  };
}
