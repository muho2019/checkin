export interface DashboardSummaryResponseDto {
  isCheckedIn: boolean;
  isCheckedOut: boolean;
  checkInDate?: string;
  checkOutDate?: string;
  workingHoursThisWeek: number;
}

export interface TodayAttendanceState {
  isCheckedIn: boolean;
  isCheckedOut: boolean;
  checkInDate?: string;
  checkOutDate?: string;
}
