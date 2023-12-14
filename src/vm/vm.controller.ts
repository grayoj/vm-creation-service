import { Controller, Post, Body, UseGuards, HttpCode, HttpException, HttpStatus, Req, Get, Param } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as https from 'https';
import { BasicAuthGuard } from 'src/auth/basic.auth.guard';
import { NutanixUrl, vmId } from 'src/constants/variables';
import { CreateVmDto } from './vm.dto';
import { Request } from 'express';


@Controller('vm')
@UseGuards(BasicAuthGuard)

export class VmController {


 constructor(private readonly httpService: HttpService) { }

 @Post('create')
 @HttpCode(201)
 async createVm(@Body() vmData: CreateVmDto, @Req() request: Request): Promise<{ message: string; task_uuid?: string }> {
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


   const successMessage = `Your VM has been created successfully.`;

   return { message: successMessage, task_uuid: response.data.task_uuid };
  } catch (error) {
   if (error.response) {
    const { status, data } = error.response;
    throw new HttpException({ message: `Nutanix API error: ${data.message}`, status }, status);
   } else if (error.request) {
    throw new HttpException('No response from Nutanix API', HttpStatus.INTERNAL_SERVER_ERROR);
   } else {
    throw new HttpException('Error setting up the request to Nutanix API', HttpStatus.INTERNAL_SERVER_ERROR);
   }
  }
 }

 @Get(':id')
 async getVmById(@Param('id') id: string, @Req() request: Request): Promise<any> {
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
    throw new HttpException({ message: `Nutanix API error: ${data.message}`, status }, status);
   } else if (error.request) {
    throw new HttpException('No response from Nutanix API', HttpStatus.INTERNAL_SERVER_ERROR);
   } else {
    throw new HttpException('Error setting up the request to Nutanix API', HttpStatus.INTERNAL_SERVER_ERROR);
   }
  }
 }

 @Post(':id/set_power_state')
 async setPowerState(@Param('id') id: string, @Body() powerStateData: { state: string }, @Req() request: Request): Promise<{ message: string; task_uuid?: string }> {
  const httpsAgent = new https.Agent({ rejectUnauthorized: false });

  try {
   const authorizationHeader = request.headers.authorization || '';
   const [, credentials] = authorizationHeader.split(' ');

   const response = await this.httpService
    .post(
     `${NutanixUrl}/vms/${vmId}/set_power_state`,
     powerStateData,
     {
      httpsAgent,
      headers: { Authorization: `Basic ${credentials}` },
     },
    )
    .toPromise();

   const successMessage = `Power state for VM ${id} has been set successfully.`;

   return { message: successMessage, task_uuid: response.data.task_uuid };
  } catch (error) {
   if (error.response) {
    const { status, data } = error.response;
    throw new HttpException({ message: `Nutanix API error: ${data.message}`, status }, status);
   } else if (error.request) {
    throw new HttpException('No response from Nutanix API', HttpStatus.INTERNAL_SERVER_ERROR);
   } else {
    throw new HttpException('Error setting up the request to Nutanix API', HttpStatus.INTERNAL_SERVER_ERROR);
   }
  }
 }
}
