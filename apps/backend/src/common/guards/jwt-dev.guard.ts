// apps/backend/src/common/guards/jwt-dev.guard.ts

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtDevGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers['authorization'] as string | undefined;
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing Bearer token (dev)');
    }
    const token = auth.split(' ')[1];
    try {
      const secret = process.env.JWT_SECRET || 'devsecret';
      const payload = jwt.verify(token, secret);
      // attach user object
      req.user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid JWT (dev)');
    }
  }
}
