export class DashboardSummaryResponseDto {
  isCheckedIn: boolean;
  isCheckedOut: boolean;
  checkInDate?: Date;
  checkOutDate?: Date;
  workingHoursThisWeek: number;
  workingDaysThisMonth: number;
  totalWorkingDaysThisMonth: number;
  averageWorkingHoursThisMonth: number;
  recentAttendanceRecords: RecentAttendanceRecordDto[];
}

export class RecentAttendanceRecordDto {
  date: Date;
  checkIn: Date;
  checkOut: Date;
}
