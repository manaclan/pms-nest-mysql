import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CreateHotelDTO } from './dtos/createHotel.dto';
import { HotelsService } from './hotels.service';
import { CreateRoomTypeDTO } from './dtos/createRoomType.dto';

@Controller('')
export class HotelsController {
  constructor(private service: HotelsService) {}
  @Post('create_hotel')
  async createHotel(
    @Body(new ValidationPipe()) request: CreateHotelDTO,
  ): Promise<any> {
    try {
      const hotel = await this.service.createHotel(request);
      return {
        statuscode: HttpStatus.OK,
        message: 'OK',
        metadata: hotel,
      };
    } catch (e) {
      console.log(e);
      return {
        statuscode: e.statuscode,
        message: e.message,
        metadata: {},
      };
    }
  }

  @Delete('delete_hotel')
  async deleteHotel(@Query('hotelCode') hotelCode: string): Promise<any> {
    try {
      const res = this.service.deleteHotel(hotelCode);
      return {
        statuscode: HttpStatus.OK,
        message: 'OK',
        metadata: res,
      };
    } catch (e) {
      console.log(e);
      return {
        statuscode: e.statuscode,
        message: e.message,
        metadata: {},
      };
    }
  }
}
