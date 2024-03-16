import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/orm/prisma.service';
import { CreateHotelDTO } from './dtos/createHotel.dto';
import { CreateRoomTypeDTO } from './dtos/createRoomType.dto';

@Injectable()
export class HotelsService {
  constructor(private prisma: PrismaService) {}

  async createHotel(createHotelDTO: CreateHotelDTO): Promise<any> {
    const { hotelCode, rooms, roomTypes } = createHotelDTO;
    if (!roomTypes)
      throw new HttpException(
        'Missing roomtypes definition',
        HttpStatus.BAD_REQUEST,
      );
    if (
      !rooms.every((r) => roomTypes.some((rt) => r.roomTypeCode === rt.code))
    ) {
      throw new HttpException(
        'Mismatch between rooms and roomTypes',
        HttpStatus.BAD_REQUEST,
      );
    }
    console.log(rooms);
    const hotel = await this.prisma.hotel.upsert({
      where: { code: hotelCode },
      update: {},
      create: {
        code: hotelCode,
        rooms: {
          createMany: {
            data: rooms,
          },
        },
        roomTypes: {
          createMany: {
            data: roomTypes,
          },
        },
      },
    });
    return hotel;
  }
}
