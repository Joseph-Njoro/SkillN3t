// apps/backend/src/modules/auth/auth.controller.ts

import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('dev-login')
  async devLogin(@Body() body: any) {
    if ((process.env.USE_CLERK || 'true').toLowerCase() === 'true') {
      throw new BadRequestException('Dev login disabled when USE_CLERK=true');
    }
    if (!body?.email) throw new BadRequestException('email required');
    return this.authService.issueDevToken(body.email);
  }
}
