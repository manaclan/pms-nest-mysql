import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsPositive,
  IsString,
  ValidateIf,
} from 'class-validator';
import { ToPhone } from 'src/utils/validatePhone';

export class CreateBookingDTO {
  @IsNotEmpty()
  // @IsDateString()
  @Transform(({ value }) => value && new Date(value))
  startDate: Date;

  @IsNotEmpty()
  // @IsDateString()
  @Transform(({ value }) => value && new Date(value))
  endDate: Date;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  customers: number;

  @IsNumber()
  @IsPositive()
  rooms?: number;

  @IsString()
  bookerName: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  @ValidateIf((o) => !o.bookerPhone)
  bookerEmail: string;

  @ToPhone
  @ValidateIf((o) => !o.bookerEmail)
  bookerPhone: string;

  @IsNotEmpty()
  roomTypes: RoomType[];
}

class RoomType {
  @IsString()
  id: string;

  @IsNumber()
  numbers: number;
}
