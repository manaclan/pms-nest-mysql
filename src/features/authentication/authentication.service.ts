import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/orm/prisma.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async signIn(
    username: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { username: username },
    });

    if (user.password !== password)
      throw new UnauthorizedException('Wrong password');
    const payload = { username: user.username };
    return { access_token: await this.jwt.signAsync(payload) };
  }
}
