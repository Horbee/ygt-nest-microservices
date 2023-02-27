import { IsString } from 'class-validator';

export class identifierParams {
  @IsString()
  identifier: string;
}
