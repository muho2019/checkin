import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendanceRecord } from './entities/attendance.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(AttendanceRecord)
    private readonly attendanceRepository: Repository<AttendanceRecord>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  private getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
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

    return await this.attendanceRepository.save(record);
  }
}
