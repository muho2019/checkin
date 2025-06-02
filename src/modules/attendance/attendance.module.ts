import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { AttendanceRecord } from './entities/attendance.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AttendanceRecord]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
