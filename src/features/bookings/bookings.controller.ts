import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CreateBookingDTO } from './dtos/createBooking.dto';
import { BookingsService } from './bookings.service';

@Controller('')
export class BookingsController {
  constructor(private service: BookingsService) {}
  @Post('create_booking')
  async createBooking(
    @Query('hotelcode') hotelCode: string,
    @Body(new ValidationPipe()) request: CreateBookingDTO,
  ): Promise<any> {
    try {
      const booking = await this.service.createBooking(hotelCode, request);
      return {
        statuscode: HttpStatus.OK,
        message: 'OK',
        metadata: booking,
      };
    } catch (e) {
      console.log(e);
      return {
        statuscode: HttpStatus.BAD_GATEWAY,
        message: e.message,
        metadata: {},
      };
    }
  }
  @Get('get_booking')
  async getBooking(
    @Query('hotelcode') hotelCode: string,
    @Query('bookingcode') bookingCode: string,
  ): Promise<any> {
    try {
      const booking = await this.service.getBooking(bookingCode, hotelCode);
      return {
        statuscode: HttpStatus.OK,
        message: 'OK',
        metadata: booking,
      };
    } catch (e) {
      console.log(e);
      return {
        statuscode: HttpStatus.BAD_GATEWAY,
        message: e.message,
        metadata: {},
      };
    }
  }
}
