import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CreateBookingDTO } from './dtos/createBooking.dto';
import { BookingsService } from './bookings.service';
import { JWTAuthGuard } from '../authentication/jwt-auth.guard';
import { GetBookingsDTO } from './dtos/getBookings.dto';
import { Role } from '../authentication/types/role';
import { Roles } from '../authentication/decorators/role.decorators';

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

  @UseGuards(JWTAuthGuard)
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

  @Get('get_bookings')
  @Roles(Role.Admin)
  async getBookings(@Body() dto: GetBookingsDTO) {
    try {
      this.service.getBookings(dto);
    } catch (e) {
      return { statuscode: HttpStatus.BAD_GATEWAY };
    }
  }
}
