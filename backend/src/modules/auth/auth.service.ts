import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { CompaniesService } from '@companies/companies.service';
import { CreateCompanyDto } from '@companies/dto/create-company.dto';
import { AuthUser } from '@interfaces/auth-user.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly companiesService: CompaniesService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: CreateUserDto): Promise<User> {
    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('이미 사용 중인 이메일입니다.');
    }

    let company = await this.companiesService.findOne(dto.companyName);

    if (!company) {
      const createCompanyDto: CreateCompanyDto = {
        name: dto.companyName,
      };
      company = await this.companiesService.create(createCompanyDto);
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    const newUser = this.userRepo.create({
      ...dto,
      password: hashed,
      company,
    });

    return await this.userRepo.save(newUser);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { email },
      relations: ['company'],
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    return user;
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const payload: AuthUser = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      companyId: user.company?.id,
      companyName: user.company?.name,
    };

    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    user.refreshToken = refreshToken;

    await this.userRepo.save(user);

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId: user.company?.id,
        companyName: user.company?.name,
      },
    };
  }

  async verifyRefreshToken(token: string): Promise<AuthUser> {
    const payload: AuthUser = this.jwtService.verify<AuthUser>(token);

    const user = await this.userRepo.findOne({ where: { id: payload.sub } });
    if (user == null || user.refreshToken !== token)
      throw new UnauthorizedException();

    return payload;
  }

  refreshAccessToken(payload: AuthUser): AuthResponseDto {
    const { exp: _exp, iat: _iat, ...cleanedPayload } = payload;
    const accessToken = this.jwtService.sign(cleanedPayload, {
      expiresIn: '15m',
    });

    return {
      accessToken,
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        role: payload.role,
        companyId: payload.companyId,
        companyName: payload.companyName,
      },
    };
  }
}
