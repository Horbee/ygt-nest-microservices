import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  public: boolean;

  @IsBoolean()
  wholeDay: boolean;

  @IsDateString()
  fromDate: Date;

  @IsDateString()
  @IsOptional()
  fromTime: Date;

  @IsDateString()
  untilDate: Date;

  @IsDateString()
  @IsOptional()
  untilTime: Date;

  @IsArray()
  @IsMongoId({ each: true })
  invitedUserIds: string[];

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsOptional()
  @IsMongoId()
  coverImageId: string;
}
