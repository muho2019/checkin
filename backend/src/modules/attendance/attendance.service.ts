import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendanceRecord } from './entities/attendance.entity';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { Role, User } from '@users/entities/user.entity';
import { StatsDto, StatsType } from './dto/stats.dto';
import {
  DateGroupedStatDto,
  StatsResponseDto,
  UserStatDto,
} from './dto/stats-response.dto';
import { AuthUser } from '@interfaces/auth-user.interface';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(AttendanceRecord)
    private readonly attendanceRepository: Repository<AttendanceRecord>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  private getTodayDate(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 시간 초기화
    return today;
  }

  async checkIn(userId: string): Promise<AttendanceRecord> {
    const today = this.getTodayDate();

    const existing = await this.attendanceRepository.findOne({
      where: { user: { id: userId }, date: today },
      relations: ['user'],
    });

    if (existing?.checkIn) {
      throw new BadRequestException('이미 출근 기록이 있습니다.');
    }

    let record = existing;

    if (!record) {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new BadRequestException('사용자를 찾을 수 없습니다.');
      }

      record = this.attendanceRepository.create({
        user,
        date: today,
        checkIn: new Date(),
      });
    } else {
      record.checkIn = new Date();
    }

    return await this.attendanceRepository.save(record);
  }

  async checkOut(userId: string): Promise<AttendanceRecord> {
    const today = this.getTodayDate();

    const record = await this.attendanceRepository.findOne({
      where: { user: { id: userId }, date: today },
      relations: ['user'],
    });

    if (!record || !record.checkIn) {
      throw new BadRequestException('출근 기록이 없거나, 출근하지 않았습니다.');
    }

    if (record.checkOut) {
      throw new BadRequestException('이미 퇴근 기록이 있습니다.');
    }

    record.checkOut = new Date();
    console.log('record is', record);
    return await this.attendanceRepository.save(record);
  }

  async getStats(user: AuthUser, dto: StatsDto): Promise<StatsResponseDto> {
    const { type, from, to } = dto;

    const whereCondition = {
      date: Between(new Date(from), new Date(to)),
      user:
        user.role === Role.EMPLOYEE
          ? { id: user.sub }
          : { company: { id: user.companyId } },
    } satisfies FindOptionsWhere<AttendanceRecord>;

    const records = await this.attendanceRepository.find({
      where: whereCondition,
      relations: ['user'],
    });

    const grouped = this.groupByPeriod(records, type);

    return { data: grouped };
  }

  private groupByPeriod(
    records: AttendanceRecord[],
    type: StatsType,
  ): DateGroupedStatDto[] {
    const result: Record<string, UserStatDto[]> = {};

    for (const record of records) {
      if (!record.checkIn || !record.checkOut) {
        continue;
      }

      const key = this.getGroupKey(this.convertToDate(record.date), type);
      const hours =
        (record.checkOut.getTime() - record.checkIn.getTime()) / 1000 / 60 / 60;

      if (!result[key]) {
        result[key] = [];
      }

      const userData = result[key].find((u) => u.userId === record.user.id);
      if (userData) {
        userData.totalHours += hours;
      } else {
        result[key].push({
          userId: record.user.id,
          name: record.user.name,
          totalHours: hours,
        });
      }
    }

    return Object.entries(result).map(([date, entries]) => ({
      date,
      entries,
    }));
  }

  private getGroupKey(date: Date, type: StatsType): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    switch (type) {
      case StatsType.DAILY:
        return `${year}-${month}-${day}`;
      case StatsType.WEEKLY: {
        const firstDay = new Date(date);
        firstDay.setDate(date.getDate() - date.getDay());
        return firstDay.toISOString().split('T')[0];
      }
      case StatsType.MONTHLY:
        return `${year}-${month}`;
    }
  }

  private convertToDate(date: string | Date): Date {
    if (typeof date === 'string') {
      return new Date(date);
    }
    return date;
  }
}
