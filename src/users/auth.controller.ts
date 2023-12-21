// auth.controller.ts
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
 constructor(private readonly authService: AuthService) { }

 @Post('register')
 async register(@Body() user: User): Promise<User> {
  return this.authService.register(user);
 }

 @Post('login')
 async login(@Body() user: User): Promise<{ accessToken: string }> {
  const loggedInUser = await this.authService.validateUser(
   user.username,
   user.password,
  );

  if (!loggedInUser) {
   throw new UnauthorizedException('Invalid credentials');
  }

  const accessToken = await this.authService.login(loggedInUser);
  return { accessToken };
 }
}
