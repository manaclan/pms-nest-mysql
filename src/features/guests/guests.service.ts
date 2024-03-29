import { Injectable } from '@nestjs/common';
import { PrismaModule } from 'src/orm/prisma.module';

@Injectable()
export class GuestsService {
  constructor(prisma: PrismaModule) {}
}
