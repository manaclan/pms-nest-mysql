import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/orm/prisma.service';
import { CreateHotelDTO } from './dtos/createHotel.dto';
import { CreateRoomTypeDTO } from './dtos/createRoomType.dto';
import { PrismaClient } from '@prisma/client';

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

    //Beside conect, we an use connectOrCreate
    //https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#connect-or-create-a-record
    const hotel = await this.prisma.hotel.upsert({
      where: { code: hotelCode },
      update: {},
      create: {
        code: hotelCode,
        rooms: {
          create: rooms.map((r) => ({
            roomName: r.roomName,
            status: r.status,
            roomType: { connect: { code: r.roomTypeCode } },
          })),
        },
        roomTypes: {
          createMany: {
            data: roomTypes,
          },
        },
      },
      include: {
        rooms: true,
        roomTypes: true,
      },
    });
    return hotel;
  }

  async getHotelList(): Promise<any> {
    return await this.prisma.hotel.findMany({ select: { code: true } });
  }

  async deleteHotel(hotelCode: string): Promise<any> {
    const deleteRooms = this.prisma.room.deleteMany({
      where: { hotelCode: hotelCode },
    });
    const deleteRoomType = this.prisma.roomType.deleteMany({
      where: { hotelCode: hotelCode },
    });
    const deleteHotel = this.prisma.hotel.delete({
      where: { code: hotelCode },
    });

    const transaction = await this.prisma.$transaction([
      deleteRooms,
      deleteRoomType,
      deleteHotel,
    ]);
    return transaction;
  }
}
