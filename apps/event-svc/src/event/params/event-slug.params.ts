import { IsNotEmpty, IsString } from 'class-validator';

export class EventSlugParams {
  @IsString({ message: 'Slug must be a valid string' })
  @IsNotEmpty({ message: 'Slug must be defined' })
  slug: string;
}
