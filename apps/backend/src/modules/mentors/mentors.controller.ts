// apps/backend/src/modules/mentors/mentors.controller.ts

import { Controller, Get, Param, Query, Post, Body, UseGuards, Req } from '@nestjs/common';
import { MentorsService } from './mentors.service';
import { AppAuthGuard } from '../../common/guards/auth.guard';
import { z } from 'zod';
import { ValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { mentorProfileSchema } from '../../../packages/shared/src/schemas';

@Controller('api/mentors')
export class MentorsController {
  constructor(private mentorsService: MentorsService) {}

  @Get()
  async list(@Query('skill') skill?: string) {
    return this.mentorsService.list({ skill });
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.mentorsService.getById(id);
  }

  @Post('me') // create/update current user's mentor profile
  @UseGuards(AppAuthGuard)
  async createOrUpdate(@Req() req: any, @Body() body: any) {
    // Validate with zod
    const parsed = ValidationPipe.validateWithSchema(mentorProfileSchema, { ...body, userId: req.user.id });
    return this.mentorsService.createOrUpdate(parsed);
  }
}
