import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { VmController } from './vm.controller';

@Module({
  imports: [HttpModule],
  controllers: [VmController],
})
export class VmModule { }
