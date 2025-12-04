// apps/backend/src/modules/uploads/uploads.controller.ts

import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { AppAuthGuard } from '../../common/guards/auth.guard';

@Controller('api/uploads')
export class UploadsController {
  constructor(private uploadsService: UploadsService) {}

  @Post('sign')
  @UseGuards(AppAuthGuard)
  async sign(@Body() body: any) {
    // body: { folder?, public_id? }
    return this.uploadsService.signUpload(body);
  }
}
