import { mapToUserDto } from 'apps/authentication/src/user/mapper';

import { Availability, User } from '@prisma/client';

import { AvailabilityDto } from '../dto';

export type CompleteAvailability = Availability & {
  owner?: User;
};

export function mapToAvailabilityDto(
  av: CompleteAvailability,
): AvailabilityDto {
  const { owner, ...restAv } = av;
  return {
    ...restAv,
    owner: owner ? mapToUserDto(owner) : null,
  };
}
