import { UserDto } from 'apps/authentication/src/user/dto';

export interface AvailabilityDto {
  id: string;
  available: string;
  comment: string | null;
  date: Date;
  fromTime: Date | null;
  untilTime: Date | null;
  createdAt: Date;
  updatedAt: Date;

  ownerId: string;
  owner?: UserDto;
  eventId: string;
}
