import { Injectable } from '@nestjs/common';
import { GetFilmDto } from 'src/films/dto/films.dto';
import { DatabaseRepository } from 'src/database/database.repository';
import { CreateTicketDto } from 'src/order/dto/order.dto';

@Injectable()
export class FilmsRepository {
  constructor(private databaseRepository: DatabaseRepository) {}

  findAll(): Promise<GetFilmDto[]> {
    return this.databaseRepository.filmsFindAll();
  }

  findFilmById(id: string): Promise<GetFilmDto> {
    return this.databaseRepository.findFilmById(id);
  }

  updateFilmSchedules(tikets: CreateTicketDto[], films?: GetFilmDto[]) {
    return this.databaseRepository.updateFilmSchedules(tikets, films);
  }
}
