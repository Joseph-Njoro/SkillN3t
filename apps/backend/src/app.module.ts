// apps/backend/src/app.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

// Feature modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MentorsModule } from './modules/mentors/mentors.module';
import { SlotsModule } from './modules/slots/slots.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { UploadsModule } from './modules/uploads/uploads.module';

@Module({
  imports: [
    // Load environment variables globally from apps/backend/.env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, '..', '.env'),
    }),

    // MongoDB Connection with retry and autoIndex
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const mongoUri = config.get<string>('MONGO_URI');
        if (!mongoUri) {
          throw new Error(
            'ERROR: !OYA!! BACKEND CANNOT START!! MONGO_URI NOT found in .env.'
          );
        }

        return {
          uri: mongoUri,
          retryAttempts: 5,
          retryDelay: 3000,
          autoIndex: process.env.NODE_ENV !== 'production', // only in dev
        };
      },
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    MentorsModule,
    SlotsModule,
    BookingsModule,
    ReviewsModule,
    UploadsModule,
  ],
})
export class AppModule {}
