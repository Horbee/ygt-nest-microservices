import { PrismaService } from '@app/common';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { Availability } from '@prisma/client';

import { AvailabilityCreateDto, AvailabilityDto } from './dto';
import { mapToAvailabilityDto } from './mapper';

@Injectable()
export class AvailabilityService {
  constructor(private prisma: PrismaService) {}

  async findAllByEventId(eventId: string): Promise<AvailabilityDto[]> {
    const avDocs = await this.prisma.availability.findMany({
      where: { eventId },
      include: { owner: true },
    });
    return avDocs.map(mapToAvailabilityDto);
  }

  async create(
    values: AvailabilityCreateDto,
    ownerId: string,
  ): Promise<AvailabilityDto> {
    const event = await this.prisma.event.findFirst({
      where: { id: values.eventId },
    });
    if (
      !event.public &&
      event.ownerId !== ownerId &&
      !event.invitedUserIds.includes(ownerId)
    ) {
      throw new BadRequestException('User is not the owner and not invited');
    }

    const createdAv = await this.prisma.availability.create({
      data: { ...values, ownerId },
    });
    return mapToAvailabilityDto(createdAv);
  }

  async updateById(
    id: string,
    updates: AvailabilityCreateDto,
    ownerId: string,
  ): Promise<AvailabilityDto> {
    const event = await this.prisma.event.findFirst({
      where: { id: updates.eventId },
    });
    if (
      !event ||
      (!event.public &&
        event.ownerId !== ownerId &&
        !event.invitedUserIds.includes(ownerId))
    ) {
      throw new BadRequestException('User is not the owner and not invited');
    }

    const avDoc = await this.prisma.availability.findFirst({
      where: { id, ownerId },
    });

    if (!avDoc)
      throw new ForbiddenException(
        'Availability not found or you are not the owner',
      );

    const { eventId, ...restUpdates } = updates;

    const updatedAv = await this.prisma.availability.update({
      data: restUpdates,
      where: { id },
    });

    return mapToAvailabilityDto(updatedAv);
  }

  async deleteById(id: string, ownerId: string): Promise<AvailabilityDto> {
    const avDoc = await this.prisma.availability.findFirst({
      where: { id, ownerId },
    });

    if (!avDoc) {
      throw new BadRequestException(
        'Availability not found or you are not the owner',
      );
    }

    const deletedAv = await this.prisma.availability.delete({
      where: { id },
    });

    return mapToAvailabilityDto(deletedAv);
  }
}
