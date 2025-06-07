import { Module } from '@nestjs/common';
import { AuthModule } from '@auth/auth.module';
import { CompaniesModule } from '@companies/companies.module';
import { UsersModule } from '@users/users.module';
import { AttendanceModule } from '@attendance/attendance.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@users/entities/user.entity';
import { Company } from '@companies/entities/company.entity';
import { AttendanceRecord } from '@attendance/entities/attendance.entity';
import { ConfigModule } from '@nestjs/config';
import { DashboardModule } from '@modules/dashboard/dashboard.module';

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
    DashboardModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
