import { Room, RoomType } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class CreateHotelDTO {
  @IsNotEmpty()
  rooms: Room[];

  @IsNotEmpty()
  hotelCode: string;

  @IsNotEmpty()
  roomTypes: RoomType[];
}
