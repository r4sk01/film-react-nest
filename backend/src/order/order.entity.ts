import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { Ticket } from './ticket.entity';

@Entity()
export class Orders {
  @PrimaryGeneratedColumn('uuid')
  @IsString()
  @IsNotEmpty()
  id: string;

  @Column()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @OneToMany(() => Ticket, (ticket) => ticket.order, { cascade: true })
  tickets: Ticket[];
}
