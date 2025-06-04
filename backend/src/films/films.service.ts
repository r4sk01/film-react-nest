import { Injectable } from '@nestjs/common';
import { FilmsRepository } from './films.repository';
import { ReturnError, ReturnFilms, ReturnSchedules } from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async findAll(): Promise<ReturnFilms> {
    const result = await this.filmsRepository.findAll();
    return { total: result.length, items: result };
  }

  async findScheduleById(id: string): Promise<ReturnSchedules | ReturnError> {
    try {
      const result = await this.filmsRepository.findFilmById(id);
      if (!result) {
        throw new Error('По заданному id данные не найдены');
      }
      return { total: result.schedule.length, items: result.schedule };
    } catch (e) {
      return { error: e.message };
    }
  }
}
