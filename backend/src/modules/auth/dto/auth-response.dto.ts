import { Role } from '@users/entities/user.entity';

export class AuthResponseDto {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: Role;
    companyId: string;
    companyName: string;
  };
}
