import { Module } from '@nestjs/common';
import { HotelsController } from './hotels.controller';
import { HotelsService } from './hotels.service';
import { PrismaModule } from 'src/orm/prisma.module';

@Module({
  controllers: [HotelsController],
  providers: [HotelsService],
  imports: [PrismaModule],
})
export class HotelsModule {}
