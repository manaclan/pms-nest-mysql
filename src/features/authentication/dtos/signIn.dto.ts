import { IsNotEmpty } from 'class-validator';

export default class SignInDTO {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string;
}
