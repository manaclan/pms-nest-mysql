import { Injectable } from '@nestjs/common';
import { CreateBookingDTO } from './dtos/createBooking.dto';
import { PrismaService } from 'src/orm/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  // findAll(): Promise<Booking[]> {
  //   return this.bookingRepository.find();
  // }

  // findOneById(id: number): Promise<Booking> {
  //   return this.bookingRepository.findOneBy({ id });
  // }

  // findOneByBookingCode(bookingCode: string): Promise<Booking> {
  //   return this.bookingRepository.findOneBy({ bookingCode });
  // }

  // async createBooking(dto: CreateBookingDTO): Promise<boolean> {
  //   const booking = this.prisma.booking.create({
  //     data: {
  //       startDate: new Date(dto.startDate),
  //       endDate: new Date(dto.endDate),
  //       bookerEmail: dto.bookerEmail,
  //       bookerName: dto.bookerName,
  //       bookerPhone: dto.bookerPhone,
  //       hotelCode: dto.
  //     },
  //   });
  // }
}
