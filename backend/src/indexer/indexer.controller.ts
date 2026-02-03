import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { IndexerService } from './indexer.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('indexer')
export class IndexerController {
  constructor(private readonly indexerService: IndexerService) {}

  @Post('start')
  @UseGuards(JwtAuthGuard)
  async startIndexing() {
    return this.indexerService.startIndexing();
  }

  @Get('stats')
  async getStats() {
    return this.indexerService.getDonationStats();
  }

  @Post('resolve-ens')
  @UseGuards(JwtAuthGuard)
  async resolveENSNames() {
    return this.indexerService.resolveENSNames();
  }
}
