// auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
 imports: [
  TypeOrmModule.forFeature([User]),
  JwtModule.register({
   secret: 'console-secret',
   signOptions: { expiresIn: '1h' },
  }),
 ],
 providers: [AuthService, UserService],
 controllers: [AuthController],
})
export class AuthModule { }
