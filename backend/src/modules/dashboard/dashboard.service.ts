import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendanceRecord } from '@attendance/entities/attendance.entity';
import { Repository } from 'typeorm';
import { DashboardSummaryResponseDto } from '@modules/dashboard/dto/dashboard-response.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(AttendanceRecord)
    private readonly attendanceRepo: Repository<AttendanceRecord>,
  ) {}

  async getSummary(userId: string): Promise<DashboardSummaryResponseDto> {
    const today = new Date();

    // 1. 오늘 출근/퇴근 여부 확인
    const todayRecord = await this.attendanceRepo.findOne({
      where: {
        user: { id: userId },
        date: today,
      },
    });

    let isCheckedIn = false;
    let isCheckedOut = false;
    let checkInDate: Date | undefined = undefined;
    let checkOutDate: Date | undefined = undefined;

    if (todayRecord !== null && todayRecord.checkIn !== null) {
      isCheckedIn = true;
      checkInDate = todayRecord.checkIn;
    }
    if (todayRecord !== null && todayRecord.checkOut !== null) {
      isCheckedOut = true;
      checkOutDate = todayRecord.checkOut;
    }

    return {
      isCheckedIn,
      isCheckedOut,
      checkInDate,
      checkOutDate,
    };
  }
}
