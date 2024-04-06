import { Body, Controller, Post, Query, ValidationPipe } from '@nestjs/common';
import { GuestsService } from './guests.service';
import { CheckinListDTO } from './dtos/checkinList.dto';

@Controller('')
export class GuestsController {
  constructor(private service: GuestsService) {}
  @Post('/checkin_list')
  async checkinList(
    @Query() bookingCode,
    @Body(new ValidationPipe()) checkinListDTO: CheckinListDTO,
  ): Promise<any> {
    try {
      await this.service.checkinList(bookingCode, checkinListDTO);
    } catch (e) {}
  }
}
