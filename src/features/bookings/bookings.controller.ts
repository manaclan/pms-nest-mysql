import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { CreateBookingDTO } from './dtos/createBooking.dto';

@Controller('')
export class BookingsController {
  @Post('create_booking')
  createBooking(@Body(new ValidationPipe()) request: CreateBookingDTO): any {
    return {
      statuscode: 'OK',
      message: '',
      metadata: {},
    };
  }
}
