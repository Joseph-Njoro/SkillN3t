// apps/backend/src/common/guards/auth.guard.ts

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { ClerkAuthGuard } from './clerk-auth.guard';
import { JwtDevGuard } from './jwt-dev.guard';

@Injectable()
export class AppAuthGuard implements CanActivate {
  private guard: CanActivate;

  constructor(private config: ConfigService) {
    const useClerk = (process.env.USE_CLERK || 'true').toLowerCase() === 'true';
    if (useClerk) {
      this.guard = new ClerkAuthGuard();
    } else {
      this.guard = new JwtDevGuard();
    }
  }

  async canActivate(context: ExecutionContext) {
    return this.guard.canActivate(context);
  }
}
