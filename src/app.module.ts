import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingsModule } from './features/bookings/bookings.module';
import { ConfigModule } from '@nestjs/config';
import { HotelsModule } from './features/hotels/hotels.module';
import { GuestsModule } from './features/guests/guests.module';

@Module({
  imports: [
    BookingsModule,
    HotelsModule,
    GuestsModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
