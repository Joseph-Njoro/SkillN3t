//apps/backend/src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './common/pipes/zod-validation.pipe';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  // Create the NestJS app with CORS enabled
  const app = await NestFactory.create(AppModule, { cors: true });

  // Global Zod validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Global response interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('SkillNet API')
    .setDescription('SkillNet backend API')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Listen on port from env or default 5000
  const port = process.env.PORT ? Number(process.env.PORT) : 5000;
  await app.listen(port);

  console.log(`Backend running on http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api/docs`);
}

bootstrap();
