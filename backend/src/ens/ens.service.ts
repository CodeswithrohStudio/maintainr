import { Injectable } from '@nestjs/common';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

@Injectable()
export class EnsService {
  private client: ReturnType<typeof createPublicClient>;

  constructor() {
    this.client = createPublicClient({
      chain: mainnet,
      transport: http(),
    });
  }

  async resolveAddress(address: string) {
    try {
      const name = await this.client.getEnsName({
        address: address as `0x${string}`,
      });
      return {
        address,
        ensName: name || null,
        success: !!name,
      };
    } catch (error) {
      return {
        address,
        ensName: null,
        success: false,
        error: error.message,
      };
    }
  }

  async resolveName(name: string) {
    try {
      const address = await this.client.getEnsAddress({ name });
      return {
        name,
        address: address || null,
        success: !!address,
      };
    } catch (error) {
      return {
        name,
        address: null,
        success: false,
        error: error.message,
      };
    }
  }

  async getAvatar(name: string) {
    try {
      const avatar = await this.client.getEnsAvatar({ name });
      return {
        name,
        avatar: avatar || null,
        success: !!avatar,
      };
    } catch (error) {
      return {
        name,
        avatar: null,
        success: false,
        error: error.message,
      };
    }
  }

  async getReverseName(address: string) {
    try {
      const name = await this.client.getEnsName({
        address: address as `0x${string}`,
      });
      return {
        address,
        reverseName: name || null,
        success: !!name,
      };
    } catch (error) {
      return {
        address,
        reverseName: null,
        success: false,
        error: error.message,
      };
    }
  }

  async getEnsProfile(address: string) {
    try {
      const name = await this.client.getEnsName({
        address: address as `0x${string}`,
      });
      
      if (!name) {
        return {
          address,
          ensName: null,
          avatar: null,
          success: false,
        };
      }

      const avatar = await this.client.getEnsAvatar({ name }).catch(() => null);

      return {
        address,
        ensName: name,
        avatar: avatar || null,
        success: true,
      };
    } catch (error) {
      return {
        address,
        ensName: null,
        avatar: null,
        success: false,
        error: error.message,
      };
    }
  }
}
