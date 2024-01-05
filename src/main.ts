import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { IpService } from './ip/ip.service';
import ipsToInsert from './constants/ips';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  const ipService = app.get(IpService);

  app.enableCors();
  for (const ip of ipsToInsert) {
    await ipService.create(ip);
  }

  await app.listen(8000);
}
bootstrap();
