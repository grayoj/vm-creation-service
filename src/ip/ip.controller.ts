import { Controller, Get, Post, Param, Body, Patch } from '@nestjs/common';
import { IpService } from './ip.service';
import { IpEntity } from './ip.entity';

@Controller('ips')
export class IpController {
  constructor(private readonly ipService: IpService) { }

  @Get()
  getAllIps(): Promise<IpEntity[]> {
    return this.ipService.getAllIps();
  }

  @Get(':id')
  getIpById(@Param('id') id: string): Promise<IpEntity | undefined> {
    return this.ipService.getIpById(Number(id));
  }

  @Post()
  createIp(@Body('ip') ip: string): Promise<IpEntity> {
    return this.ipService.createIp(ip);
  }

  @Patch(':id')
  updateIpAvailability(
    @Param('id') id: string,
    @Body('availability') availability: boolean,
  ): Promise<IpEntity | undefined> {
    return this.ipService.updateIpAvailability(Number(id), availability);
  }
}
