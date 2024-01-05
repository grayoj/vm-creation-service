import {
 Controller,
 Post,
 Body,
 UseGuards,
 HttpCode,
 HttpException,
 HttpStatus,
 Req,
 Get,
 Param,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as https from 'https';
import { BasicAuthGuard } from 'src/auth/basic.auth.guard';
import { NutanixUrl, vmId } from 'src/constants/variables';
import { CreateVmDto } from './vm.dto';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { IpEntity } from 'src/ip/ip.entity';
import { FindOneOptions, Repository } from 'typeorm';

@Controller('vm')
@UseGuards(BasicAuthGuard)
export class VmController {
 constructor(
  private readonly httpService: HttpService,
  @InjectRepository(IpEntity)
  private readonly ipAddressRepository: Repository<IpEntity>,
 ) { }

 @Post('create')
 @HttpCode(201)
 async createVm(
  @Body() vmData: CreateVmDto,
  @Req() request: Request,
 ): Promise<{ message: string; task_uuid?: string; selectedIp: string }> {
  const httpsAgent = new https.Agent({ rejectUnauthorized: false });

  try {
   const authorizationHeader = request.headers.authorization || '';
   const [, credentials] = authorizationHeader.split(' ');

   const response = await this.httpService
    .post(
     `${NutanixUrl}/vms?include_vm_disk_config=true&include_vm_nic_config=true`,
     vmData,
     {
      httpsAgent,
      headers: { Authorization: `Basic ${credentials}` },
     },
    )
    .toPromise();

   const randomIpAddress: any = await this.getRandomIpAddress();

   await this.updateIpAddressAvailability(randomIpAddress, false);

   const successMessage = `Your VM has been created successfully.`;
   const formattedIpAddress = `http://${randomIpAddress.ip}:9595`;

   return {
    message: successMessage,
    task_uuid: response.data.task_uuid,
    selectedIp: formattedIpAddress,
   };
  } catch (error) {
   if (error.response) {
    const { status, data } = error.response;
    throw new HttpException(
     { message: `Nutanix API error: ${data.message}`, status },
     status,
    );
   } else if (error.request) {
    throw new HttpException(
     'No response from Nutanix API',
     HttpStatus.INTERNAL_SERVER_ERROR,
    );
   } else {
    throw new HttpException(
     'Error setting up the request to Nutanix API',
     HttpStatus.INTERNAL_SERVER_ERROR,
    );
   }
  }
 }

 private async getRandomIpAddress(): Promise<string> {
  const count = await this.ipAddressRepository.count();
  const randomIndex = Math.floor(Math.random() * count);

  const randomIpAddress = await this.ipAddressRepository.findOne({
   skip: randomIndex,
  } as FindOneOptions<IpEntity>);

  if (!randomIpAddress) {
   throw new Error('No IP address found.');
  }

  const formattedIpAddress = `http://${randomIpAddress.ip}:9595`;

  return formattedIpAddress;
 }
 private async updateIpAddressAvailability(
  ipAddress: IpEntity,
  availability: boolean,
 ): Promise<void> {
  await this.ipAddressRepository.update(ipAddress.id, { availability });
 }

 @Get(':id')
 async getVmById(
  @Param('id') id: string,
  @Req() request: Request,
 ): Promise<any> {
  const httpsAgent = new https.Agent({ rejectUnauthorized: false });

  try {
   const authorizationHeader = request.headers.authorization || '';
   const [, credentials] = authorizationHeader.split(' ');

   const response = await this.httpService
    .get(`${NutanixUrl}/vms/${vmId}`, {
     httpsAgent,
     headers: { Authorization: `Basic ${credentials}` },
    })
    .toPromise();

   return response.data;
  } catch (error) {
   if (error.response) {
    const { status, data } = error.response;
    throw new HttpException(
     { message: `Nutanix API error: ${data.message}`, status },
     status,
    );
   } else if (error.request) {
    throw new HttpException(
     'No response from Nutanix API',
     HttpStatus.INTERNAL_SERVER_ERROR,
    );
   } else {
    throw new HttpException(
     'Error setting up the request to Nutanix API',
     HttpStatus.INTERNAL_SERVER_ERROR,
    );
   }
  }
 }

 @Post(':id/set_power_state')
 async setPowerState(
  @Param('id') id: string,
  @Body() powerStateData: { state: string },
  @Req() request: Request,
 ): Promise<{ message: string; task_uuid?: string }> {
  const httpsAgent = new https.Agent({ rejectUnauthorized: false });

  try {
   const authorizationHeader = request.headers.authorization || '';
   const [, credentials] = authorizationHeader.split(' ');

   const response = await this.httpService
    .post(`${NutanixUrl}/vms/${vmId}/set_power_state`, powerStateData, {
     httpsAgent,
     headers: { Authorization: `Basic ${credentials}` },
    })
    .toPromise();

   const successMessage = `Power state for VM ${id} has been set successfully.`;

   return { message: successMessage, task_uuid: response.data.task_uuid };
  } catch (error) {
   if (error.response) {
    const { status, data } = error.response;
    throw new HttpException(
     { message: `Nutanix API error: ${data.message}`, status },
     status,
    );
   } else if (error.request) {
    throw new HttpException(
     'No response from Nutanix API',
     HttpStatus.INTERNAL_SERVER_ERROR,
    );
   } else {
    throw new HttpException(
     'Error setting up the request to Nutanix API',
     HttpStatus.INTERNAL_SERVER_ERROR,
    );
   }
  }
 }
}
