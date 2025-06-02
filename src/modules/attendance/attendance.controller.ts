import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AttendanceService } from './attendance.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('attendance')
@UseGuards(AuthGuard('jwt'))
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in')
  async checkIn(@CurrentUser() user: any) {
    return await this.attendanceService.checkIn(user.sub);
  }

  @Post('check-out')
  async checkOut(@CurrentUser() user: any) {
    return await this.attendanceService.checkOut(user.sub);
  }
}
