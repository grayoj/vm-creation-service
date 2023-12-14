/**
 * Gerald Maduabuchi - 2023
 * Enables the client to send
 * HTTP requests with the Authorization header that contains
 * the Basic word followed by a space and a
 * base64-encoded username:password string.
 * This is basically your Nutanix Username and Password on the console.
 * https://172.31.1.10:9440/console/#login
 */

import {
 Injectable,
 CanActivate,
 ExecutionContext,
 UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class BasicAuthGuard implements CanActivate {
 canActivate(context: ExecutionContext) {
  const request = context.switchToHttp().getRequest();
  const authorizationHeader = request.headers.authorization || '';
  const [type, credentials] = authorizationHeader.split(' ');

  if (type === 'Basic' && credentials) {
   return true;
  }

  throw new UnauthorizedException('Invalid credentials');
 }
}
