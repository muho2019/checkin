import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendanceRecord } from '@attendance/entities/attendance.entity';
import { Between, IsNull, Not, Repository } from 'typeorm';
import { DashboardSummaryResponseDto } from '@modules/dashboard/dto/dashboard-response.dto';
import {
  addDays,
  differenceInHours,
  endOfMonth,
  parseISO,
  startOfMonth,
  startOfToday,
  startOfWeek,
} from 'date-fns';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(AttendanceRecord)
    private readonly attendanceRepo: Repository<AttendanceRecord>,
  ) {}

  async getSummary(userId: string): Promise<DashboardSummaryResponseDto> {
    const today = startOfToday();

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

    // 2. 이번 주 근무 시간
    const monday = startOfWeek(today, { weekStartsOn: 1 }); // 월요일
    const sunday = addDays(monday, 6); // 일요일

    const recordsThisWeek = await this.attendanceRepo.find({
      where: {
        user: { id: userId },
        date: Between(monday, sunday),
        checkOut: Not(IsNull()), // 퇴근 기록이 있는 경우만
      },
    });
    const workingHoursThisWeek = recordsThisWeek
      .map((r) => differenceInHours(r.checkOut, r.checkIn))
      .reduce((acc, cur) => acc + cur, 0);

    // 3. 이번 달 근무일
    const firstDayOfMonth = startOfMonth(today);
    const lastDayOfMonth = endOfMonth(today);

    const recordsThisMonth = await this.attendanceRepo.find({
      where: {
        user: { id: userId },
        date: Between(firstDayOfMonth, lastDayOfMonth),
        checkOut: Not(IsNull()), // 퇴근 기록이 있는 경우만
      },
    });
    const workingHoursThisMonth = recordsThisWeek
      .map((r) => differenceInHours(r.checkOut, r.checkIn))
      .reduce((acc, cur) => acc + cur, 0);
    const workingDaysThisMonth = recordsThisMonth.length;

    //TODO: 이번 달 전체 근무일 수 계산
    const totalWorkingDaysThisMonth = 20;

    const averageWorkingHoursThisMonth =
      workingHoursThisMonth / workingDaysThisMonth;

    // 4. 최근 근태 기록 (최근 5일)
    const recentRecords = await this.attendanceRepo.find({
      where: {
        user: { id: userId },
        checkOut: Not(IsNull()),
      },
      order: { date: 'DESC' },
      take: 5,
    });

    const recentAttendanceRecords = recentRecords.map((r) => ({
      date: r.date,
      checkIn: r.checkIn,
      checkOut: r.checkOut,
    }));

    return {
      isCheckedIn,
      isCheckedOut,
      checkInDate,
      checkOutDate,
      workingHoursThisWeek,
      workingDaysThisMonth,
      totalWorkingDaysThisMonth,
      averageWorkingHoursThisMonth,
      recentAttendanceRecords,
    };
  }
}
