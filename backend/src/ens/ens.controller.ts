import { Controller, Get, Param, Query } from '@nestjs/common';
import { EnsService } from './ens.service';

@Controller('ens')
export class EnsController {
  constructor(private readonly ensService: EnsService) {}

  @Get(':address')
  async getEnsByAddress(@Param('address') address: string) {
    return this.ensService.resolveAddress(address);
  }

  @Get('name/:name')
  async getAddressByName(@Param('name') name: string) {
    return this.ensService.resolveName(name);
  }

  @Get('avatar/:name')
  async getAvatar(@Param('name') name: string) {
    return this.ensService.getAvatar(name);
  }

  @Get('reverse/:address')
  async getReverseName(@Param('address') address: string) {
    return this.ensService.getReverseName(address);
  }
}
