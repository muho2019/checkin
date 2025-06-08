export class DashboardSummaryResponseDto {
  isCheckedIn: boolean;
  isCheckedOut: boolean;
  checkInDate?: Date;
  checkOutDate?: Date;
  workingHoursThisWeek: number;
  workingDaysThisMonth: number;
  totalWorkingDaysThisMonth: number;
}
