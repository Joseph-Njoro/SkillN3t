// apps/backend/src/modules/auth/auth.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async issueDevToken(email: string) {
    // ensure user exists
    let user = await this.usersService.findByEmail(email);
    if (!user) {
      user = await this.usersService.createOrUpdateFromAuth({ email, name: email.split('@')[0] });
    }
    const payload = { id: user._id, email: user.email, role: user.role };
    const secret = process.env.JWT_SECRET || 'devsecret';
    const token = jwt.sign(payload, secret, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    return { token, user: payload };
  }
}
