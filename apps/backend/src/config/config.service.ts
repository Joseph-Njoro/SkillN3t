// apps/backend/src/config/config.service.ts

import * as dotenv from 'dotenv';
dotenv.config();

export class ConfigService {
  get(key: string): string {
    const val = process.env[key];
    if (typeof val === 'undefined') {
      throw new Error(`Missing env var ${key}`);
    }
    return val;
  }

  getOptional(key: string): string | undefined {
    return process.env[key];
  }
}
