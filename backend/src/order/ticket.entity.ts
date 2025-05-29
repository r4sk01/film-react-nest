import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { IsNotEmpty, IsNumber, IsString, IsDateString } from 'class-validator';
import { Orders } from './order.entity';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  @IsString()
  @IsNotEmpty()
  id: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  film: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  session: string;

  @Column()
  @IsString()
  @IsDateString()
  @IsNotEmpty()
  daytime: string;

  @Column()
  @IsNumber()
  @IsNotEmpty()
  row: number;

  @Column()
  @IsNumber()
  @IsNotEmpty()
  seat: number;

  @Column()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ManyToOne(() => Orders, (order) => order.tickets)
  order: Orders;
}
