import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { UsersModule } from './modules/users/users.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/users/entities/user.entity';
import { Company } from './modules/companies/entities/company.entity';
import { AttendanceRecord } from './modules/attendance/entities/attendance.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port:
          (process.env.DB_PORT && parseInt(process.env.DB_PORT, 10)) || 5432,
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'attendance_db',
        autoLoadEntities: true,
        synchronize: true, // Set to false in production
        entities: [User, Company, AttendanceRecord],
      }),
    }),
    TypeOrmModule.forFeature([User, Company, AttendanceRecord]),
    AuthModule,
    CompaniesModule,
    UsersModule,
    AttendanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
