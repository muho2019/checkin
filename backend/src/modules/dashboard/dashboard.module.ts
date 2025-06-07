import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceRecord } from '@attendance/entities/attendance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AttendanceRecord])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
