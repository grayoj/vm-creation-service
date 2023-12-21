// auth.service.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
 constructor(
  private readonly userService: UserService,
  private readonly jwtService: JwtService,
 ) { }

 async validateUser(username: string, password: string): Promise<User | null> {
  const user = await this.userService.findByUsername(username);

  if (user && (await bcrypt.compare(password, user.password))) {
   return user;
  }

  return null;
 }

 async login(user: User): Promise<string> {
  const payload = { username: user.username, sub: user.id };
  return this.jwtService.sign(payload);
 }

 async register(user: User): Promise<User> {
  const existingUser = await this.userService.findByUsername(user.username);

  if (existingUser) {
   throw new ConflictException('Username is already taken');
  }

  // Hash the password before saving it
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const newUser: User = {
   ...user,
   password: hashedPassword,
   validatePassword: async () => true,
  };

  return this.userService.create(newUser);
 }
}
