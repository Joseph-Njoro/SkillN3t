// apps/backend/src/modules/slots/slots.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Slot, SlotSchema } from './schemas/slot.schema';
import { SlotsService } from './slots.service';
import { SlotsController } from './slots.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Slot.name, schema: SlotSchema }])],
  providers: [SlotsService],
  controllers: [SlotsController],
  exports: [SlotsService]
})
export class SlotsModule {}
