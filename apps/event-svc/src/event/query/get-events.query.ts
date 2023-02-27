import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty } from 'class-validator';

export type EventType = 'own' | 'invited' | 'public';

export class GetEventsQuery {
  @IsNotEmpty()
  @IsIn(['own', 'invited', 'public'])
  type: EventType;

  @IsInt()
  @Type(() => Number)
  start: number = 0;

  @IsInt()
  @Type(() => Number)
  size: number = 10;
}
