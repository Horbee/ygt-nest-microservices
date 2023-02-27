import { GetUser, Messages, Public } from '@app/common';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { User } from '@prisma/client';

import { UserCreateDto } from '../user/dto';
import { IsIdentifierTaken } from '../user/guards/is-identifier-taken';
import { AuthService } from './auth.service';
import { AzureAuthGuard, JwtAuthGuard, JwtRTGuard, LocalAuthGuard } from './guards';
import { UserWithRefreshToken } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(IsIdentifierTaken)
  @Post('local/register')
  async register(@Body() userCreateDto: UserCreateDto) {
    return this.authService.register(userCreateDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('local/login')
  async login(@GetUser() user: User) {
    return this.authService.login(user);
  }

  @Post('local/logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  logout(@GetUser() user: User): Promise<boolean> {
    return this.authService.logout(user.id);
  }

  @Public()
  @Post('local/refresh')
  @UseGuards(JwtRTGuard)
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@GetUser() user: UserWithRefreshToken) {
    return this.authService.refreshTokens(user.identifier, user.refreshToken);
  }

  @UseGuards(AzureAuthGuard)
  @Get('test')
  async test(@GetUser() user: User) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern(Messages.VALIDATE_USER)
  async validateUser(@GetUser() user: User) {
    return user;
  }
}
