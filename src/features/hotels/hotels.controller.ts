import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { CreateHotelDTO } from './dtos/createHotel.dto';
import { HotelsService } from './hotels.service';
import { CreateRoomTypeDTO } from './dtos/createRoomType.dto';

@Controller('hotels')
export class HotelsController {
  constructor(private service: HotelsService) {}
  @Post('create_hotel')
  async createHotel(
    @Body(new ValidationPipe()) request: CreateHotelDTO,
  ): Promise<any> {
    try {
      const hotel = await this.service.createHotel(request);
      return {
        statuscode: 'OK',
        message: '',
        metadata: hotel,
      };
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  //   @Post('create_room_type')
  //   async createRoomType(
  //     @Body(new ValidationPipe()) request: CreateRoomTypeDTO,
  //   ): Promise<any> {
  //     try{
  //       const hotel = await this.service.createRoomType(request);
  //     }

  //     return {
  //       statuscode: 'OK',
  //       message: '',
  //       metadata: hotel,
  //     };
  //   }
}
