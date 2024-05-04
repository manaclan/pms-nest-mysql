import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { PrismaModule } from 'src/orm/prisma.module';

@Module({
  providers: [AuthenticationService],
  controllers: [AuthenticationController],
  imports: [PrismaModule],
})
export class AuthenticationModule {}
