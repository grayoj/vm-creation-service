// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VmModule } from './vm/vm.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'default',
    }),
    TypeOrmModule.forRoot({
      name: 'connection2',
    }),
    VmModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
