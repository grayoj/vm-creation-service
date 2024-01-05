// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VmModule } from './vm/vm.module';
import { AuthModule } from './users/auth.module';
import { User } from './users/user.entity';
import { IpModule } from './ip/ip.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'consoledb',
      entities: [User],
      synchronize: true,
    }),
    AuthModule,
    VmModule,
    IpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
