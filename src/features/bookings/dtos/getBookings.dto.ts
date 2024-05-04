import { Optional } from '@nestjs/common';
import { Transform } from 'class-transformer';

export class GetBookingsDTO {
  @Optional()
  @Transform(({ value }) => value && new Date(value))
  start: Date;
}
