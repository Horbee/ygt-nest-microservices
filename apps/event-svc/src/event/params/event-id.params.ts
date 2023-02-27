import { IsMongoId } from 'class-validator';

export class EventIdParams {
  @IsMongoId({ message: 'Object id is not valid' })
  eventId: string;
}
