import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsPositive,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateBookingDTO {
  @IsNotEmpty()
  startDate: Date;

  @IsNotEmpty()
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

  @IsEmail()
  @ValidateIf((o) => !o.bookerPhone)
  bookerEmail: string;

  @IsPhoneNumber()
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
