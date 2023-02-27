import { UserDto } from '../../user/dto';

export interface AuthResponseDto {
  access_token: string;
  refresh_token: string;
  user: UserDto;
}
