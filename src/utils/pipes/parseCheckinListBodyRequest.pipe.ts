import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { CheckinListDTO } from 'src/features/guests/dtos/checkinList.dto';

@Injectable()
export class ParseCheckinListBodyRequestPipe implements PipeTransform {
  transform(value, metadata): CheckinListDTO {
    if (!Array.isArray(value))
      throw new BadRequestException('Invalid request body');

    const dto: CheckinListDTO = {
      roomsWithGuests: value.map((r) => {
        const { roomid, guests } = r;
        return {
          roomId: roomid,
          guests: guests.map((g) => {
            return { firstName: g.first_name, lastName: g.last_name, ...g };
          }),
        };
      }),
    };
    return dto;
  }
}
