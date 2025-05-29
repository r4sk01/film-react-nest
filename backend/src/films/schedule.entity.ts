import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Films } from './film.entity';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@Entity()
export class Schedules {
  @PrimaryGeneratedColumn('uuid')
  @IsString()
  @IsNotEmpty()
  id: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  daytime: string;

  @Column()
  @IsNumber()
  @IsNotEmpty()
  hall: number;

  @Column()
  @IsNumber()
  @IsNotEmpty()
  rows: number;

  @Column()
  @IsNumber()
  @IsNotEmpty()
  seats: number;

  @Column()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  taken: string;

  @ManyToOne(() => Films, (film) => film.schedule)
  film: Films;
}
