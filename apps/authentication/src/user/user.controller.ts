import { GetUser } from '@app/common';
import { Body, Controller, Get, Put, Query, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';

import { JwtAuthGuard } from '../auth/guards';
import { UserDto, UserUpdateDto } from './dto';
import { mapToUserDto } from './mapper';
import { identifierParams } from './params';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async findAllByIdentifier(
    @Query() { identifier }: identifierParams,
  ): Promise<UserDto[]> {
    return this.userService.findAllByIdentifier(identifier);
  }

  @Get('me')
  async getProfile(@GetUser() user: User): Promise<UserDto> {
    return mapToUserDto(user);
  }

  @Put('me')
  async updateProfile(
    @GetUser() user: User,
    @Body() userDto: UserUpdateDto,
  ): Promise<UserDto> {
    return this.userService.updateProfile(user, userDto);
  }
}
