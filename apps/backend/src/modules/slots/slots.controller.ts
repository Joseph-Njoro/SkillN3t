// apps/backend/src/modules/slots/slots.controller.ts

import { Controller, Post, Body, Param, Get, UseGuards, Req } from '@nestjs/common';
import { SlotsService } from './slots.service';
import { AppAuthGuard } from '../../common/guards/auth.guard';
import { slotSchema } from '../../../packages/shared/src/schemas';
import { ValidationPipe } from '../../common/pipes/zod-validation.pipe';

@Controller('api/mentors')
export class SlotsController {
  constructor(private slotsService: SlotsService) {}

  @Post(':id/slots')
  @UseGuards(AppAuthGuard)
  async createSlot(@Param('id') mentorId: string, @Body() body: any, @Req() req: any) {
    // body: { startTime, durationMins }
    const parsed = ValidationPipe.validateWithSchema(slotSchema, body);
    return this.slotsService.create(mentorId, new Date(parsed.startTime), parsed.durationMins);
  }

  @Get(':id/slots')
  async listMentorSlots(@Param('id') mentorId: string) {
    return this.slotsService.listByMentor(mentorId);
  }
}
