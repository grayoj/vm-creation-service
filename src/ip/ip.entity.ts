import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class IpEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  ip: string;

  @Column({ default: true })
  availability: boolean;
}
