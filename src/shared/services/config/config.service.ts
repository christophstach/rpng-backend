import * as dotenv from 'dotenv';
import * as fs from 'fs';

export class ConfigService {
  private readonly envConfig: { [prop: string]: string };

  constructor(filePath: string) {
    if (fs.existsSync(filePath)) {
      this.envConfig = dotenv.parse(fs.readFileSync(filePath));
    } else {
      this.envConfig = null;
    }
  }

  get(key: string): string {
    if (this.envConfig) {
      return this.envConfig[key];
    } else {
      return process.env[key];
    }
  }
}

export const configService = new ConfigService(`config/${process.env.NODE_ENV}.env`);