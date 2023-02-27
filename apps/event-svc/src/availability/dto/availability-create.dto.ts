import { IsDateString, IsIn, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AvailabilityCreateDto {
  @IsNotEmpty()
  @IsIn(['good', 'maybe', 'notgood'])
  available: string;

  @IsString()
  @IsOptional()
  comment: string;

  @IsDateString()
  date: Date;

  @IsOptional()
  @IsDateString()
  fromTime: Date;

  @IsOptional()
  @IsDateString()
  untilTime: Date;

  @IsMongoId()
  eventId: string;
}
