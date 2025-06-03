export class UserStatDto {
  userId: string;
  name: string;
  totalHours: number;
}

export class DateGroupedStatDto {
  date: string;
  entries: UserStatDto[];
}

export class StatsResponseDto {
  data: DateGroupedStatDto[];
}
