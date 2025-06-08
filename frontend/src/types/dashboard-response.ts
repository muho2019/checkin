export interface DashboardSummaryResponse {
  isCheckedIn: boolean;
  isCheckedOut: boolean;
  checkInDate?: Date;
  checkOutDate?: Date;
  workingHoursThisWeek: number;
  workingDaysThisMonth: number;
  totalWorkingDaysThisMonth: number;
  averageWorkingHoursThisMonth: number;
  recentAttendanceRecords: DashboardRecentAttendanceRecord[];
}

export interface DashboardRecentAttendanceRecord {
  date: Date;
  checkIn: Date;
  checkOut: Date;
}

export interface TodayAttendanceState {
  isCheckedIn: boolean;
  isCheckedOut: boolean;
  checkInDate?: Date;
  checkOutDate?: Date;
}
