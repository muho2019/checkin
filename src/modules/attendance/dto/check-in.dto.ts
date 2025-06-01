import { IsString, IsDateString } from 'class-validator';

export class CheckInDto {
  @IsString()
  userId: string;

  @IsDateString()
  date: string;
}
