import { mapToUserDto } from 'apps/authentication/src/user/mapper';

import { Attachment, Availability, Event, User } from '@prisma/client';

import { mapToAttachmentDto } from '../../attachment/mapper';
import { mapToAvailabilityDto } from '../../availability/mapper';
import { EventDto, Paginated } from '../dto';

type CompleteEvent = Event & {
  owner?: User;
  invitedUsers?: User[];
  coverImage?: Attachment;
  availabilities?: Availability[];
};

export function mapToEventDto(event: CompleteEvent): EventDto {
  return {
    ...event,
    owner: event.owner ? mapToUserDto(event.owner) : null,
    invitedUsers: event.invitedUsers
      ? event.invitedUsers.map(mapToUserDto)
      : null,
    coverImage: event.coverImage ? mapToAttachmentDto(event.coverImage) : null,
    availabilities: event.availabilities
      ? event.availabilities.map(mapToAvailabilityDto)
      : null,
  };
}

export function mapToPaginatedEventDto(
  events: Array<CompleteEvent>,
  total: number,
): Paginated<EventDto> {
  return {
    content: events.map(mapToEventDto),
    total,
  };
}
