import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { CircleService } from './circle.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('circle')
export class CircleController {
  constructor(private readonly circleService: CircleService) {}

  @Post('wallet')
  @UseGuards(JwtAuthGuard)
  async createWallet() {
    return this.circleService.createWallet();
  }

  @Get('wallet/:id/balance')
  @UseGuards(JwtAuthGuard)
  async getWalletBalance(@Param('id') id: string) {
    return this.circleService.getWalletBalance(id);
  }

  @Post('payment')
  @UseGuards(JwtAuthGuard)
  async createPayment(@Body() body: { amount: string; recipientAddress: string }) {
    return this.circleService.createPayment(body.amount, body.recipientAddress);
  }

  @Get('payment/:id')
  @UseGuards(JwtAuthGuard)
  async getPaymentStatus(@Param('id') id: string) {
    return this.circleService.getPaymentStatus(id);
  }

  @Post('payout')
  @UseGuards(JwtAuthGuard)
  async distributeToContributors(@Body() body: { 
    projectId: number; 
    recipients: Array<{ address: string; amount: string }> 
  }) {
    return this.circleService.distributeToContributors(body.projectId, body.recipients);
  }
}
