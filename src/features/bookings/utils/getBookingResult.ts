import { Guest, Prisma } from '@prisma/client';
import { getBooking } from '../bookings.service';

type Booking = Prisma.PromiseReturnType<typeof getBooking>;

export class GetBookingResult {
  bookingCode: string;
  startDate: Date;
  endDate: Date;
  customers: number;
  bookerName: string;
  bookerPhone: string;
  bookerEmail: string;
  firstName: string;
  lastName: string;
  hotelCode: string;
  rooms: RoomInBooking[];

  constructor(booking: Booking) {
    this.bookingCode = booking.hotelCode + booking.id;
    this.startDate = booking.startDate;
    this.endDate = booking.endDate;
    this.customers = booking.customers;
    this.bookerName = booking.bookerName;
    this.bookerPhone = booking.bookerPhone;
    this.bookerEmail = booking.bookerEmail;
    this.firstName = booking.firstName;
    this.lastName = booking.lastName;
    this.rooms = booking.rooms.map((r) => {
      return {
        startTime: r.startTime,
        endTime: r.endTime,
        roomId: r.id.toString(),
        totalCustomersRemain: r.roomType.capacity,
        roomTypeCode: r.roomTypeCode,
        status: r.status,
        roomCode: r.roomId ? r.roomId.toString() : '',
        roomName: '',
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
