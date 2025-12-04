// apps/backend/src/common/guards/clerk-auth.guard.ts

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Clerk } from '@clerk/clerk-sdk-node';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers['authorization'] as string | undefined;
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing Bearer token');
    }
    const token = auth.split(' ')[1];
    const clerkClient = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });
    try {
      // verify via Clerk's /v1/sessions? or use verifySessionJwt; using getUserFromJwt is an example:
      const jwt = token;
      // Clerk's server SDK provides function to verify JWTs; here we do a lightweight approach:
      const session = await clerkClient.sessions.verifySessionToken(jwt).catch(() => null);
      if (!session) {
        // Attempt to decode token to get userId via clerk SDK or treat as invalid
        throw new UnauthorizedException('Invalid Clerk session token');
      }
      // `session` may have userId
      req.user = { id: session.userId };
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid Clerk token');
    }
  }
}
