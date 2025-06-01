import { IsEnum, IsDateString } from 'class-validator';

export enum StatsType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export class StatsDto {
  @IsEnum(StatsType)
  type: StatsType;

  @IsDateString()
  from: string;

  @IsDateString()
  to: string;
}
