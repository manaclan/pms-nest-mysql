import { Injectable } from '@nestjs/common';
import { CreateBookingDTO } from './dtos/createBooking.dto';
import { PrismaService } from 'src/orm/prisma.service';
import { CreateBookingResult } from './utils/createBookingResult';
import { GetBookingResult } from './utils/getBookingResult';
import { GetBookingsDTO } from './dtos/getBookings.dto';

const createBooking = async (
  hotelCode: string,
  dto: CreateBookingDTO,
  prisma: PrismaService,
): Promise<any> => {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findFirst({
      where: { hotelCode: hotelCode },
      orderBy: { id: 'desc' },
    });
    console.log(booking);
    return await tx.booking.create({
      data: {
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        customers: dto.customers,
        bookerEmail: dto.bookerEmail,
        bookerName: dto.bookerName,
        bookerPhone: dto.bookerPhone,
        firstName: dto.firstName,
        lastName: dto.lastName,
        hotel: { connect: { code: hotelCode } },
        rooms: {
          createMany: {
            data: dto.roomTypes.reduce((acc, curr) => {
              for (let i = 0; i < curr.numbers; i++) {
                acc = acc.concat([
                  {
                    startTime: new Date(dto.startDate),
                    endTime: new Date(dto.endDate),
                    roomTypeCode: curr.id,
                  },
                ]);
              }
              return acc;
            }, []),
          },
        },
        hotelSpecificId: booking ? booking.hotelSpecificId + 1 : 1,
        bookingCode: booking
          ? hotelCode + (booking.hotelSpecificId + 1).toString()
          : hotelCode + '1',
      },

      include: {
        rooms: {
          include: {
            roomType: true,
            guests: true,
          },
        },
      },
    });
  });
};

const getBooking = async (
  bookingCode: string,
  hotelCode: string,
  prisma: PrismaService,
) => {
  const booking = await prisma.booking.findUnique({
    where: { bookingCode: bookingCode },
    include: {
      rooms: {
        include: {
          roomType: true,
          guests: true,
        },
      },
    },
  });
  return booking;
};

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async createBooking(hotelCode: string, dto: CreateBookingDTO): Promise<any> {
    try {
      const booking = await createBooking(hotelCode, dto, this.prisma);
      const result = new CreateBookingResult(booking);
      return { ...result };
    } catch (e) {
      throw e;
    }
  }

  async getBooking(bookingCode: string, hotelCode: string): Promise<any> {
    try {
      const booking = await getBooking(bookingCode, hotelCode, this.prisma);
      const result = new GetBookingResult(booking);
      return { ...result };
    } catch (e) {
      throw e;
    }
  }

  async getBookings(queryOption: GetBookingsDTO): Promise<any> {
    return await this.prisma.booking.findMany({});
  }
}
