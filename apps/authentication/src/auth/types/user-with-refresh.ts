import { User } from '@prisma/client';

export type UserWithRefreshToken = {
  refreshToken: string;
} & User;
