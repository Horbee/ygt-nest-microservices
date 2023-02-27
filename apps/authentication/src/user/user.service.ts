import * as argon from 'argon2';

import { Events, PrismaService, Services } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User } from '@prisma/client';

import { UserCreateDto, UserDto } from './dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { mapToUserDto } from './mapper';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    @Inject(Services.MESSAGING) private messagingClient: ClientProxy,
  ) {}

  async findAllByIdentifier(identifier: string): Promise<UserDto[]> {
    const users = await this.prisma.user.findMany({
      where: { identifier: { contains: identifier } },
    });

    return users.map(mapToUserDto);
  }

  async findOne(identifier: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({ where: { identifier } });
  }

  async create(data: UserCreateDto): Promise<User> {
    data.password = await argon.hash(data.password);

    const createdUser = await this.prisma.user.create({ data });

    // Emit event to send welcome email
    this.messagingClient.emit(Events.USER_CREATED, createdUser.identifier);

    return createdUser;
  }

  async updateProfile(
    { id, ...restUser }: User,
    userDto: UserUpdateDto,
  ): Promise<UserDto> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { ...restUser, ...userDto },
    });
    return mapToUserDto(updatedUser);
  }

  async updateRefreshTokenHash(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const refreshTokenHash = await argon.hash(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash },
    });
  }
}
