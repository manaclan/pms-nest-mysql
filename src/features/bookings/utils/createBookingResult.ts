import { Guest, Prisma } from '@prisma/client';
import { createBooking } from '../bookings.service';
import * as moment from 'moment';

type BookingWithRooms = Prisma.PromiseReturnType<typeof createBooking>;
export class CreateBookingResult {
  bookingCode: string;
  startDate: string;
  endDate: string;
  customers: number;
  bookerName: string;
  bookerEmail: string;
  firstName: string;
  lastName: string;
  hotelCode: string;
  rooms: RoomInBooking[];

  constructor(result: BookingWithRooms) {
    this.bookingCode = result.hotelCode + result.id;
    this.startDate = moment(new Date(result.startDate)).format('DD/MM/YYYY');
    this.endDate = moment(new Date(result.endDate)).format('DD/MM/YYYY');
    this.customers = result.customers;
    this.bookerName = result.bookerName;
    this.firstName = result.firstName;
    this.lastName = result.lastName;
    this.rooms = result.rooms.map((r) => {
      return {
        startTime: r.startTime,
        endTime: r.endTime,
        roomId: r.id.toString(),
        totalCustomersRemain: r.roomType.capacity,
        roomTypeCode: r.roomTypeCode,
        status: r.status,
        roomCode: r.roomId ? r.roomId.toString() : '',
        guests: r.guests ? r.guests : [],
      };
    });
  }
}

class RoomInBooking {
  startTime: Date;
  endTime: Date;
  roomId: string;
  roomName: string;
  roomCode: string;
  totalCustomersRemain: number;
  roomTypeCode: string;
  status: string;
  guests: Guest[];
}
