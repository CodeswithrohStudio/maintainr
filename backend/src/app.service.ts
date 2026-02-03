import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Maintainr Backend API - OSS Funding Platform';
  }
}
