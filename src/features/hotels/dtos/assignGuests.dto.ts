import { Expose, Transform, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class AssignGuestsDTO {
  @IsNotEmpty()
  roomId: string;

  @Type(() => GuestDTO)
  guests: GuestDTO[];
}

class GuestDTO {
  @Expose({ name: 'first_name' })
  @IsNotEmpty()
  firstName: string;

  @Expose({ name: 'last_name' })
  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  gender: string;

  @Expose({ name: 'birth_date' })
  @IsNotEmpty()
  @Transform(({ value }) => value && new Date(value))
  birthDay: Date;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  address: string;
}
