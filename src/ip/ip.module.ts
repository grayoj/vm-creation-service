import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IpEntity } from './ip.entity';
import { IpService } from './ip.service';
import { IpController } from './ip.controller';

@Module({
  imports: [TypeOrmModule.forFeature([IpEntity])],
  providers: [IpService],
  controllers: [IpController],
  exports: [IpService],
})
export class IpModule { }
