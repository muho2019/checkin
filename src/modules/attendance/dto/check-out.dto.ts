import { IsString, IsDateString } from 'class-validator';

export class CheckOutDto {
  @IsString()
  userId: string;

  @IsDateString()
  date: string;
}
