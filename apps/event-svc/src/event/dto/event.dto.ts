import { UserDto } from 'apps/authentication/src/user/dto';

import { AttachmentDto } from '../../attachment/dto';
import { AvailabilityDto } from '../../availability/dto';

export interface EventDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  public: boolean;
  wholeDay: boolean;
  fromDate: Date;
  fromTime?: Date;
  untilDate: Date;
  untilTime?: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;

  ownerId: string;
  owner?: UserDto;
  invitedUserIds: string[];
  invitedUsers?: UserDto[];
  coverImageId?: string;
  coverImage?: AttachmentDto;
  availabilities?: AvailabilityDto[];
}
