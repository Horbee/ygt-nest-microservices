import { PrismaService } from '@app/common';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { AttachmentService } from '../attachment/attachment.service';
import { CreateEventDto, EventDto, Paginated } from './dto';
import { mapToEventDto, mapToPaginatedEventDto } from './mapper';
import { EventType } from './query';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(
    private prisma: PrismaService,
    private attachmentService: AttachmentService,
  ) {}

  async getEventBySlug(
    slug: string,
    withAvailabilities: boolean,
  ): Promise<EventDto> {
    const event = await this.prisma.event.findUnique({
      where: { slug },
      include: {
        owner: true,
        invitedUsers: true,
        coverImage: true,
        availabilities: withAvailabilities
          ? {
              include: { owner: true },
            }
          : false,
      },
    });

    if (!event) throw new BadRequestException('Event not found.');

    return mapToEventDto(event);
  }

  async getEventById(id: string): Promise<EventDto> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { owner: true, invitedUsers: true, coverImage: true },
    });

    if (!event) throw new BadRequestException('Event not found.');

    return mapToEventDto(event);
  }

  async getPaginatedEvents(
    type: EventType,
    start: number,
    size: number,
    userId: string,
  ): Promise<Paginated<EventDto>> {
    const where: Prisma.EventWhereInput = {
      ownerId: type === 'own' ? userId : undefined,
      invitedUserIds: type === 'invited' ? { has: userId } : undefined,
      public: type === 'public' ? true : undefined,
    };

    const totalPromise = this.prisma.event.count({ where });

    const eventsPromise = this.prisma.event.findMany({
      where,
      include: { coverImage: true },
      skip: start,
      take: size,
    });

    const [total, events] = await Promise.all([totalPromise, eventsPromise]);

    return mapToPaginatedEventDto(events, total);
  }

  async createEvent(
    createEventDto: CreateEventDto,
    owner: User,
  ): Promise<EventDto> {
    const newEvent = {
      ...createEventDto,
      ownerId: owner.id,
    };

    const eventWithSlug = await this.prisma.event.findUnique({
      where: { slug: createEventDto.slug },
    });

    if (eventWithSlug) {
      throw new BadRequestException('Slug is already taken');
    }

    const createdEvent = await this.prisma.event.create({
      data: newEvent,
    });

    return mapToEventDto(createdEvent);
  }

  async updateEvent(
    id: string,
    updates: CreateEventDto,
    user: User,
  ): Promise<EventDto> {
    const event = await this.prisma.event.findFirst({
      where: { id },
    });

    if (!event) throw new BadRequestException('Event not found');
    if (event.ownerId !== user.id)
      throw new ForbiddenException('Only the owner can update this event');

    const updatedEvent = await this.prisma.event.update({
      data: updates,
      where: { id },
    });

    return mapToEventDto(updatedEvent);
  }

  async deleteEvent(id: string, user: User): Promise<EventDto> {
    const event = await this.prisma.event.findFirst({
      where: { id },
    });

    if (!event) throw new BadRequestException('Event not found');
    if (event.ownerId !== user.id)
      throw new ForbiddenException('Only the owner can delete this event');

    const deletedEvent = await this.prisma.event.delete({
      where: { id },
      include: { coverImage: true },
    });

    // If relation exists, try to delete image
    if (deletedEvent.coverImage) {
      try {
        await this.attachmentService.deleteImageByPublicId(
          deletedEvent.coverImage.public_id,
        );
      } catch (err) {
        this.logger.error(
          `Cover image with id ${deletedEvent.coverImageId} can not be deleted`,
        );
        console.error(err);
      }
    }

    return mapToEventDto(deletedEvent);
  }
}
