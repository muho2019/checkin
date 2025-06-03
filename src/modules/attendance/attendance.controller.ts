import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AttendanceService } from './attendance.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { StatsDto } from './dto/stats.dto';
import { StatsResponseDto } from './dto/stats-response.dto';
import { AuthUser } from '../../common/interfaces/auth-user.interface';

@Controller('attendance')
@UseGuards(AuthGuard('jwt'))
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in')
  async checkIn(@CurrentUser() user: AuthUser) {
    return await this.attendanceService.checkIn(user.sub);
  }

  @Post('check-out')
  async checkOut(@CurrentUser() user: AuthUser) {
    return await this.attendanceService.checkOut(user.sub);
  }

  @Get('stats')
  async getStats(
    @Query() dto: StatsDto,
    @CurrentUser() user: AuthUser,
  ): Promise<StatsResponseDto> {
    return this.attendanceService.getStats(user, dto);
  }
}
