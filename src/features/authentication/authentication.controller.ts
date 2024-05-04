import {
  Body,
  Controller,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import SignInDTO from './dtos/SignIn.dto';

@Controller('')
export class AuthenticationController {
  constructor(private service: AuthenticationService) {}

  @Post('signin')
  async signIn(@Body(new ValidationPipe()) dto: SignInDTO) {
    await this.service.signIn(dto.username, dto.password);
    return { status: HttpStatus.OK, message: 'Sign in succeed' };
  }
}
