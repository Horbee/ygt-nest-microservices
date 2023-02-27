import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class WithAvailabilitiesQuery {
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  withAvailabilities: boolean;
}
