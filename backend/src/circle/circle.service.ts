import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CircleService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.CIRCLE_API_KEY || '';
    this.baseUrl = 'https://api.circle.com/v1';
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  async createWallet() {
    try {
      const response = await axios.post(
        `${this.baseUrl}/wallets`,
        {
          accountType: 'EOA',
          blockchain: 'ETH-SEPOLIA',
        },
        { headers: this.getHeaders() }
      );
      return {
        success: true,
        wallet: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }

  async getWalletBalance(walletId: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/wallets/${walletId}/balances`,
        { headers: this.getHeaders() }
      );
      return {
        success: true,
        balances: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }

  async createPayment(amount: string, recipientAddress: string, tokenId?: string) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/payments`,
        {
          amount: {
            amount: amount,
            currency: 'USD',
          },
          source: {
            type: 'wallet',
            id: 'source-wallet-id', // This would come from your treasury wallet
          },
          destination: {
            type: 'blockchain',
            address: recipientAddress,
            chain: 'ETH-SEPOLIA',
          },
          tokenId: tokenId || 'USDC-SEPOLIA',
        },
        { headers: this.getHeaders() }
      );
      return {
        success: true,
        payment: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }

  async getPaymentStatus(paymentId: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/payments/${paymentId}`,
        { headers: this.getHeaders() }
      );
      return {
        success: true,
        payment: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }

  async distributeToContributors(projectId: number, recipients: Array<{ address: string; amount: string }>) {
    try {
      const payments = recipients.map(recipient => ({
        amount: { amount: recipient.amount, currency: 'USD' },
        source: { type: 'wallet', id: 'maintainr-treasury' },
        destination: { type: 'blockchain', address: recipient.address, chain: 'ETH-SEPOLIA' },
        tokenId: 'USDC-SEPOLIA',
      }));

      const response = await axios.post(
        `${this.baseUrl}/payments/batch`,
        { payments },
        { headers: this.getHeaders() }
      );

      return {
        success: true,
        batchId: response.data.id,
        payments: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }
}
