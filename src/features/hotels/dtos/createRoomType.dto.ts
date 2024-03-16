import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoomTypeDTO {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
