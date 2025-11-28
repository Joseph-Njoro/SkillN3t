// apps/backend/src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';

@Module({
  imports: [
    // Load environment variables only from apps/backend/.env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, '..', '.env'),
    }),

    // MongoDB Connection
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const mongoUri = configService.get<string>('MONGO_URI');

        if (!mongoUri) {
          throw new Error(
            ' ERROR: OYA!! BACKEND CANNOT START!! MONGO_URI NOT found in .env.'
          );
        }

        return {
          uri: mongoUri,
          retryAttempts: 5,
          retryDelay: 3000,
          autoIndex: process.env.NODE_ENV !== 'production', // index only in dev
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
