import * as argon from 'argon2';

import { PrismaService } from '@app/common';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UserCreateDto } from '../user/dto';
import { mapToUserDto } from '../user/mapper';
import { UserService } from '../user/user.service';
import { AuthResponseDto } from './dto';

import type { User } from '@prisma/client';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userService.findOne(username);
    if (user && (await argon.verify(user.password, password))) {
      return user;
    }
    return null;
  }

  async login(user: User): Promise<AuthResponseDto> {
    const tokens = await this.signTokens(user);
    await this.userService.updateRefreshTokenHash(
      user.id,
      tokens.refresh_token,
    );

    return {
      ...tokens,
      user: mapToUserDto(user),
    };
  }

  async register(userCreateDto: UserCreateDto): Promise<AuthResponseDto> {
    const userDoc = await this.userService.create(userCreateDto);
    return this.login(userDoc);
  }

  async logout(userId: string): Promise<boolean> {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        refreshTokenHash: { not: null },
      },
      data: { refreshTokenHash: null },
    });
    return true;
  }

  async refreshTokens(identifier: string, refreshToken: string) {
    const user = await this.userService.findOne(identifier);

    if (!user || !user.refreshTokenHash)
      throw new ForbiddenException('Access Denied');

    const rtMatches = await argon.verify(user.refreshTokenHash, refreshToken);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const decoded = this.jwtService.decode(refreshToken) as { exp: number };
    const validSeconds = Math.ceil(
      (new Date(decoded.exp * 1000).getTime() - new Date().getTime()) / 1000,
    );

    const tokens = await this.signTokens(user, validSeconds);
    await this.userService.updateRefreshTokenHash(
      user.id,
      tokens.refresh_token,
    );

    return tokens;
  }

  async signTokens(user: User, refreshTokenExpiration?: number) {
    const payload = { username: user.identifier, sub: user.id };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_RT_SECRET'),
        expiresIn: refreshTokenExpiration ?? '7d',
      }),
    ]);

    return { access_token, refresh_token };
  }
}
