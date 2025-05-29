import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Schedules } from './schedule.entity';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@Entity()
export class Films {
  @PrimaryGeneratedColumn('uuid')
  @IsString()
  @IsNotEmpty()
  id: string;

  @Column()
  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  director: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  tags: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  image: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  cover: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  about: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  description: string;

  @OneToMany(() => Schedules, (schedule) => schedule.film)
  schedule: Schedules[];
}
