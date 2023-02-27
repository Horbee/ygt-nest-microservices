import { IsMongoId } from 'class-validator';

export class AvailabilityIdParams {
  @IsMongoId({ message: 'Object id is not valid' })
  availabilityId: string;
}
