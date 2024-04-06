import { HttpException, HttpStatus } from '@nestjs/common';
import { Expose, Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class CheckinListDTO {
  @ValidateNested()
  roomsWithGuests: RoomWithGuestsInfo[];
}

class RoomWithGuestsInfo {
  @IsNotEmpty()
  @Expose({ name: 'roomid' })
  roomId: string;

  @ValidateNested()
  @IsNotEmpty()
  guests: Guest[];
}

class Guest {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @Transform(({ value }) => {
    if (value === '1') return 1;
    else if (value === '0') return 0;
    else throw new HttpException('Bad request', 400);
  })
  gender: boolean;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  birthDate: Date;

  @IsNotEmpty()
  @ValidateIf((o) => !o.email)
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  @ValidateIf((o) => !o.phone)
  email: string;

  @IsNotEmpty()
  address: string;
}
