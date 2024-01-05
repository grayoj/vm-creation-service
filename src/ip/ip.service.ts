import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IpEntity } from './ip.entity';

@Injectable()
export class IpService {
  constructor(
    @InjectRepository(IpEntity)
    private readonly ipRepository: Repository<IpEntity>,
  ) { }

  async createIp(ip: string): Promise<IpEntity> {
    const newIp = this.ipRepository.create({ ip });
    return await this.ipRepository.save(newIp);
  }

  async create(ip: string): Promise<IpEntity> {
    const newIp = this.ipRepository.create({ ip });
    return await this.ipRepository.save(newIp);
  }

  async getAllIps(): Promise<IpEntity[]> {
    return await this.ipRepository.find();
  }

  async getIpById(id: any): Promise<IpEntity | undefined> {
    return await this.ipRepository.findOne(id);
  }

  async updateIpAvailability(
    id: any,
    availability: boolean,
  ): Promise<IpEntity | undefined> {
    await this.ipRepository.update(id, { availability });
    return await this.ipRepository.findOne(id);
  }
}
