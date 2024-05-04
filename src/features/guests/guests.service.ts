import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/orm/prisma.service';
import { CheckinListDTO } from './dtos/checkinList.dto';
import { Prisma, RoomInBooking } from '@prisma/client';
import moment from 'moment';

@Injectable()
export class GuestsService {
  constructor(private prisma: PrismaService) {}

  validateAvailableGuestsAllRooms(dto, roomsProcessed, roomTypes) {
    if (
      dto.roomsWithGuests.some((r) => {
        const roomTypeCode = roomsProcessed[r.roomId.toString()].roomTypeCode;
        const currRoomType = roomTypes.filter((rt) => rt.code === roomTypeCode);
        if (currRoomType.length !== 1)
          throw new HttpException(
            'Failed to get room type',
            HttpStatus.BAD_REQUEST,
          );
        const numCustomersRemained = roomsProcessed[r.roomId]
          .totalCustomersRemain
          ? roomsProcessed[r.roomId].totalCustomersRemain
          : currRoomType[0].capacity;
        if (r.guests.length > numCustomersRemained) return true;
        else return false;
      })
    )
      throw new HttpException(
        'Number of checkin customers exceed allowed',
        HttpStatus.BAD_REQUEST,
      );
  }

  validateGuestsStatus(guests, dtoGuestsDict) {
    if (
      guests.some(
        (g) =>
          g.status !== 'BOOKED' &&
          (dtoGuestsDict[g.email] || dtoGuestsDict[g.phone]),
      )
    )
      throw new HttpException('Guests status conflict', HttpStatus.BAD_REQUEST);
  }

  createDTOGuestsDict(r) {
    r.guests.reduce((acc, curr) => {
      if (!curr.phone && !curr.email)
        throw new HttpException(
          'Email or phone is required',
          HttpStatus.BAD_REQUEST,
        );
      acc[curr.email] = 1;
      acc[curr.phone] = 1;
      return acc;
    }, {});
  }

  async assignOrCreateNewGuests(tx, r) {
    return await tx.roomInBooking.update({
      where: { id: Number(r.roomId) },
      data: {
        status: 'CHECKIN',
        guests: {
          upsert: r.guests.map((g) => {
            return {
              where: {
                emailPhone: {
                  email: g.email,
                  phone: g.phone,
                },
              },
              update: { status: 'CHECKIN' },
              create: {
                name: `${g.firstName} ${g.lastName}`,
                firstName: g.firstName,
                lastName: g.lastName,
                email: g.email,
                address: g.address,
                phone: g.phone,
                startDate: Date.now(),
                endDate: Date.now(),
                status: 'CHECKIN',
              },
            };
          }),
        },
      },
    });
  }

  async validateNumberOfRoomsInDTO(bookingRooms, dto: CheckinListDTO, tx) {
    let roomCount = {};
    bookingRooms.forEach((r) => {
      if (roomCount[r.roomTypeCode]) roomCount[r.roomTypeCode]++;
      else roomCount[r.roomTypeCode] = 1;
    });
    const dtoRooms = await tx.room.findMany({
      where: {
        id: {
          in: dto.roomsWithGuests.map((r) => {
            return Number(r.roomId);
          }),
        },
      },
    });
    dtoRooms.forEach((r) => {
      roomCount[r.roomTypeCode]--;
    });
    for (const [k, v] of Object.entries(roomCount)) {
      if (v && Number(v) < 0)
        throw new HttpException(
          `Number of room type ${k} in request exceeded assigned number`,
          HttpStatus.BAD_REQUEST,
        );
    }
    return dtoRooms;
  }

  async checkinList(bookingCode: string, dto: CheckinListDTO): Promise<any> {
    const res = await this.prisma.$transaction(async (tx) => {
      //get rooms in booking
      let bookingRooms = await tx.$queryRaw<
        any[]
      >`select * from rooms_bookings r where bookingCode = ${bookingCode};`;
      if (!bookingRooms.length)
        throw new HttpException('No booking found', HttpStatus.BAD_REQUEST);
      bookingRooms = bookingRooms.map((r): RoomInBooking => {
        const { roomcode, ...rest } = r;
        return { id: roomcode, ...rest };
      });
      const roomTypes = await tx.roomType.findMany({
        where: { hotelCode: bookingCode.replace(/[0-9]/g, '') },
      });
      const roomsProcessed = bookingRooms.reduce((acc, curr) => {
        if (curr.roomId) acc[curr.roomId.toString()] = curr;
        return acc;
      }, {});
      // if all rooms in dto exist in bookingRooms
      if (
        dto.roomsWithGuests.every((r) =>
          bookingRooms
            .filter((r) => r.roomId)
            .some((rq) => r.roomId === rq.roomId.toString()),
        )
      ) {
        this.validateAvailableGuestsAllRooms(dto, roomsProcessed, roomTypes);
        // foreach room in booking
        for (let r of dto.roomsWithGuests) {
          // if guests exists make sure they are BOOKED
          const guests = await tx.guest.findMany({
            where: { roomId: Number(r.roomId) },
          });
          const dtoGuestsDict = this.createDTOGuestsDict(r);
          this.validateGuestsStatus(guests, dtoGuestsDict);
          // update guests status or assign the remain guests to the existed rooms
          this.assignOrCreateNewGuests(tx, r);
        }
      }
      // else if (some rooms in dto exist in rooms)
      else if (dto.roomsWithGuests.some((r) => roomsProcessed[r.roomId])) {
        //Check #rooms in dto satisfied #room allowed in booking
        await this.validateNumberOfRoomsInDTO(bookingRooms, dto, tx);
        // if(any rooms has #guests in dto > #guests remained in existed rooms) throw err
        this.validateAvailableGuestsAllRooms(dto, roomsProcessed, roomTypes);
        // checkin guests that have already been in room
        for (let r of dto.roomsWithGuests.filter(
          (r) => roomsProcessed[r.roomId],
        )) {
          // if guests exists make sure they are BOOKED
          const guests = await tx.guest.findMany({
            where: { roomId: Number(r.roomId) },
          });

          const dtoGuestsDict = this.createDTOGuestsDict(r);
          this.validateGuestsStatus(guests, dtoGuestsDict);
          // update existing guests status
          tx.roomInBooking.update({
            where: { id: Number(r.roomId) },
            data: {
              guests: {
                updateMany: { where: {}, data: { status: 'CHECKIN' } },
              },
            },
          });
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
      } else if (bookingRooms.every((r) => r.roomId === null)) {
        //Check #rooms in dto satisfied #room allowed in booking
        const dtoRooms = await this.validateNumberOfRoomsInDTO(
          bookingRooms,
          dto,
          tx,
        );

        const roomInDB = await tx.room.findMany({
          where: {
            id: { in: dto.roomsWithGuests.map((r) => Number(r.roomId)) },
          },
          include: { roomType: true },
        });
        // check if roomId in dto still available in database
        if (bookingRooms.every((r) => r.status === 'BOOKED')) {
          if (
            dto.roomsWithGuests.some((rwg) => {
              const r = roomInDB.filter(
                (rid) => rid.id.toString() === rwg.roomId,
              );
              if (!r || r.length !== 1)
                throw new HttpException(
                  'Failed while validating number of guests assigned for each room',
                  HttpStatus.BAD_REQUEST,
                );
              if (rwg.guests.length > r[0].roomType.capacity) return true;
              return false;
            })
          )
            throw new HttpException(
              'Number of checkin customers exceed allowed',
              HttpStatus.BAD_REQUEST,
            );
          // 1- check status for all roomIds in dto in database

          if (roomInDB.every((r) => r.status !== 'BOOKED'))
            throw new HttpException(
              'Some room have invalid status',
              HttpStatus.BAD_REQUEST,
            );
          // 2. assign room + guests
          let roomMap = {};
          roomInDB.forEach((r) => {
            const bkRooms = bookingRooms.filter(
              (bk) => bk.roomTypeCode === r.roomTypeCode,
            );
            for (const room of bkRooms) {
              if (!roomMap[room.id]) {
                roomMap[room.id] = r;
                break;
              }
            }
          });
          //assign room
          for (const [k, v] of Object.entries(roomMap)) {
            const CREATEMANY_DATAGUESTS: Prisma.GuestCreateManyRoomInput[] =
              dto.roomsWithGuests
                .filter((rwg) => rwg.roomId === (v as any).id.toString())[0]
                .guests.map((g) => {
                  return {
                    name: `${g.lastName} ${g.firstName}`,
                    lastName: g.lastName,
                    firstName: g.firstName,
                    email: g.email,
                    phone: g.phone,
                    address: g.address,
                  };
                });
            console.log(CREATEMANY_DATAGUESTS);
            const assignedResults = await tx.roomInBooking.update({
              where: { id: Number(k) },
              data: {
                room: { connect: { id: Number((v as any).id) } },
                guests: {
                  createMany: { data: CREATEMANY_DATAGUESTS },
                },
              },
              include: { guests: true },
            });
            return assignedResults;
          }
        }
        // else throw error
        else
          throw new HttpException('Room status error', HttpStatus.BAD_REQUEST);
      }
    });
    return res;
  }
}
