import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { PrismaModule } from 'src/orm/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
