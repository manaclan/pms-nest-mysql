import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { GuestsService } from './guests.service';
import { CheckinListDTO } from './dtos/checkinList.dto';
import { ParseCheckinListBodyRequestPipe } from 'src/utils/pipes/parseCheckinListBodyRequest.pipe';

@Controller('')
export class GuestsController {
  constructor(private service: GuestsService) {}
  @Post('/checkin_list')
  async checkinList(
    @Query('bookingCode') bookingCode,
    @Body(new ValidationPipe(), new ParseCheckinListBodyRequestPipe())
    checkinListDTO: CheckinListDTO,
  ): Promise<any> {
    try {
      const res = await this.service.checkinList(bookingCode, checkinListDTO);
      return {
        statuscode: HttpStatus.OK,
        message: 'OK',
        metadata: res,
      };
    } catch (e) {
      return {
        statuscode: e.statuscode,
        message: e.message,
        metadata: {},
      };
    }
  }
}
