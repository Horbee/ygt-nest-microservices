import { GetUser, JwtAuthGuard } from '@app/common';
import {
  Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { EventIdParams } from '../event/params';
import { AvailabilityService } from './availability.service';
import { AvailabilityCreateDto, AvailabilityDto } from './dto';
import { AvailabilityIdParams } from './params';

@UseGuards(JwtAuthGuard)
@Controller('availabilities')
export class AvailabilityController {
  constructor(private availabilityService: AvailabilityService) {}

  @Get('event/:eventId')
  async findAllByEventId(
    @Param() { eventId }: EventIdParams,
  ): Promise<AvailabilityDto[]> {
    return this.availabilityService.findAllByEventId(eventId);
  }

  @Post()
  async create(
    @Body() createAvailabilityDto: AvailabilityCreateDto,
    @GetUser() user: User,
  ): Promise<AvailabilityDto> {
    return this.availabilityService.create(createAvailabilityDto, user.id);
  }

  @Put(':availabilityId')
  async updateById(
    @Param() { availabilityId }: AvailabilityIdParams,
    @Body() dto: AvailabilityCreateDto,
    @GetUser() user: User,
  ): Promise<AvailabilityDto> {
    const availability = await this.availabilityService.updateById(
      availabilityId,
      dto,
      user.id,
    );
    if (!availability) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return availability;
  }

  @Delete(':availabilityId')
  async deleteById(
    @Param() { availabilityId }: AvailabilityIdParams,
    @GetUser() user: User,
  ): Promise<AvailabilityDto> {
    const availability = await this.availabilityService.deleteById(
      availabilityId,
      user.id,
    );
    if (!availability) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return availability;
  }
}
