import { IsNotEmpty, IsString } from 'class-validator';

export class UserUpdateDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
