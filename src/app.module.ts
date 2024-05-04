import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingsModule } from './features/bookings/bookings.module';
import { ConfigModule } from '@nestjs/config';
import { HotelsModule } from './features/hotels/hotels.module';
import { GuestsModule } from './features/guests/guests.module';
import { AuthenticationModule } from './features/authentication/authentication.module';
import { JwtModule } from '@nestjs/jwt';
import { JWTStrategy } from './features/authentication/authentication.strategy';

@Module({
  imports: [
    BookingsModule,
    HotelsModule,
    GuestsModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    AuthenticationModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: 7 * 24 * 60 * 60 },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, JWTStrategy],
})
export class AppModule {}
