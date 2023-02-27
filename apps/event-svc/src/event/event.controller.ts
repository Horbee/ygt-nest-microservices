import { GetUser, JwtAuthGuard } from '@app/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { CreateEventDto, EventDto, Paginated } from './dto';
import { EventService } from './event.service';
import { EventIdParams, EventSlugParams } from './params';
import { GetEventsQuery, WithAvailabilitiesQuery } from './query';

@UseGuards(JwtAuthGuard)
@Controller('events')
export class EventController {
  constructor(private eventService: EventService) {}

  @Get('slug/:slug')
  getEventBySlug(
    @Param() { slug }: EventSlugParams,
    @Query() { withAvailabilities }: WithAvailabilitiesQuery,
  ): Promise<EventDto> {
    return this.eventService.getEventBySlug(slug, withAvailabilities);
  }

  @Get(':eventId')
  getEventById(@Param() { eventId }: EventIdParams): Promise<EventDto> {
    return this.eventService.getEventById(eventId);
  }

  @Get()
  getEvents(
    @Query() { type, start, size }: GetEventsQuery,
    @GetUser() user: User,
  ): Promise<Paginated<EventDto>> {
    return this.eventService.getPaginatedEvents(type, start, size, user.id);
  }

  @Post()
  createEvent(
    @Body() createEventDto: CreateEventDto,
    @GetUser() user: User,
  ): Promise<EventDto> {
    return this.eventService.createEvent(createEventDto, user);
  }

  @Put(':eventId')
  updateEvent(
    @Param() { eventId }: EventIdParams,
    @Body() createEventDto: CreateEventDto,
    @GetUser() user: User,
  ): Promise<EventDto> {
    return this.eventService.updateEvent(eventId, createEventDto, user);
  }

  @Delete(':eventId')
  deleteEvent(
    @Param() { eventId }: EventIdParams,
    @GetUser() user: User,
  ): Promise<EventDto> {
    return this.eventService.deleteEvent(eventId, user);
  }
}
