import { Module } from '@nestjs/common';
import { GuestsController } from './guests.controller';
import { GuestsService } from './guests.service';
import { PrismaModule } from 'src/orm/prisma.module';

@Module({
  controllers: [GuestsController],
  providers: [GuestsService],
  imports: [PrismaModule],
})
export class GuestsModule {}
