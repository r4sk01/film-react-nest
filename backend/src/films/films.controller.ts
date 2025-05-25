import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import {
  FindFilmIdParams,
  ReturnError,
  ReturnFilms,
  ReturnSchedules,
} from './dto/films.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get('/')
  async findFilmsAll(): Promise<ReturnFilms> {
    return this.filmsService.findAll();
  }

  @Get('/:id/schedule/')
  async findFilmScheduleById(
    @Param() params: FindFilmIdParams,
  ): Promise<ReturnSchedules | ReturnError> {
    return this.filmsService.findScheduleById(params.id);
  }
}
