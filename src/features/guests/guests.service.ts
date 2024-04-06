import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/orm/prisma.service';
import { CheckinListDTO } from './dtos/checkinList.dto';
import { RoomInBooking } from '@prisma/client';

@Injectable()
export class GuestsService {
  constructor(private prisma: PrismaService) {}

  async checkinList(bookingCode: string, dto: CheckinListDTO): Promise<any> {
    const res = await this.prisma.$transaction(async (tx) => {
      //get rooms in booking
      const rooms = await tx.$queryRaw<
        RoomInBooking[]
      >`select * from rooms_bookings r where bookingCode = ${bookingCode};`;
      const roomTypes = await tx.roomType.findMany({
        where: { hotelCode: bookingCode.replace(/[0-9]/g, '') },
      });
      const roomsProcessed = rooms.reduce(
        (acc, curr) => (acc[curr.roomId.toString()] = curr),
        {},
      );
      // if all rooms in dto exist in rooms
      if (
        dto.roomsWithGuests.every((r) =>
          rooms.some((rq) => r.roomId === rq.id.toString()),
        )
      ) {
        // if #guest in dto exceed allowed guests number
        if (
          dto.roomsWithGuests.some((r) => {
            const roomTypeCode =
              roomsProcessed[r.roomId.toString()].roomTypeCode;
            const currRoomType = roomTypes.filter(
              (rt) => rt.code === roomTypeCode,
            );
            if (currRoomType.length !== 1)
              throw Error('Failed to get room type');
            const numCustomersRemained = roomsProcessed[r.roomId]
              .totalCustomersRemain
              ? roomsProcessed[r.roomId].totalCustomersRemain
              : currRoomType[0].capacity;
            if (r.guests.length > numCustomersRemained) return true;
            else return false;
          })
        )
          throw Error('Number of checkin customers exceed allowed');
        // else assign guest to room
        else {
          // foreach room in booking
          for (let r of dto.roomsWithGuests) {
            // if guests exists make sure they are BOOKED
            const guests = await tx.guest.findMany({
              where: { roomInBookingId: Number(r.roomId) },
            });

            const dtoGuestsDict = r.guests.reduce((acc, curr) => {
              if (!curr.phone && !curr.email)
                throw Error('Email or phone is required');
              acc[curr.email] = 1;
              acc[curr.phone] = 1;
              return acc;
            }, {});
            if (
              guests.some(
                (g) =>
                  g.status !== 'BOOKED' &&
                  (dtoGuestsDict[g.email] || dtoGuestsDict[g.phone]),
              )
            )
              throw Error('Guests status conflict');

            // assign the remain guests
            tx.roomInBooking.update({
              where: { id: Number(r.roomId) },
              data: {
                status: 'CHECKIN',
                guests: {
                  createMany: {
                    data: r.guests.map((g) => {
                      return {
                        name: `${g.firstName} ${g.lastName}`,
                        firstName: g.firstName,
                        lastName: g.lastName,
                        email: g.email,
                        address: g.address,
                        phone: g.phone,
                        status: 'CHECKIN',
                      };
                    }),
                  },
                },
              },
            });
          }
        }
      }
      // else if (some rooms in dto exist in rooms && some rooms in dto can fit into rooms)
      // if(any room has guests in dto > remained in existed rooms) throw err
      // if(rooms that not existed have #guests > capactity) throw err
      // assign room - change state
      // assign guest
      // else throw error
    });
    return res;
  }
}
