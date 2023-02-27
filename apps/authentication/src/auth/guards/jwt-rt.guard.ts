import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class JwtRTGuard extends AuthGuard('jwt-refresh') {
  constructor() {
    super();
  }
}
