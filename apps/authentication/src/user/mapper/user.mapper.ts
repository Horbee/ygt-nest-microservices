import { User } from '@prisma/client';

import { UserDto } from '../dto';

export function mapToUserDto(user: User): UserDto {
  return {
    id: user.id,
    identifier: user.identifier,
    name: user.name,
  };
}
