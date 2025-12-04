// apps/backend/src/modules/users/users.controller.ts

import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { AppAuthGuard } from '../../common/guards/auth.guard';

@Controller('api/users')
@UseGuards(AppAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async me(@Req() req: any) {
    const id = req.user?.id || req.user?._id || req.user?.sub;
    if (!id) return { message: 'no user in request (dev?)' };
    return this.usersService.findById(id);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}
