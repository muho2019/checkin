import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { Role } from '@users/entities/user.entity';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsEnum(Role)
  role: Role;

  @IsString()
  companyName: string;
}
