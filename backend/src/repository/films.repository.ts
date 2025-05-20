import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, FilmsDocument } from './films.schema';
import { GetFilmDto, Schedule } from 'src/films/dto/films.dto';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectModel(Film.name) private filmModel: Model<FilmsDocument>,
  ) {}

  findAll(): Promise<GetFilmDto[]> {
    return this.filmModel.find().lean();
  }

  findByIds(ids: string[]): Promise<GetFilmDto[]> {
    return this.filmModel.find({ id: { $in: ids } }).lean();
  }

  findFilmById(id: string): Promise<GetFilmDto> {
    return this.filmModel.findOne({ id }).lean();
  }

  updateFilmScheduleById(id: string, schedule: Schedule[]) {
    return this.filmModel.updateOne({ id }, { $set: { schedule } });
  }

  updateScheduleSeat(filmId: string, sessionId: string, seat: string) {
    return this.filmModel.updateOne(
      { id: filmId, 'schedule.id': sessionId },
      { $push: { 'schedule.$.taken': seat } },
    );
  }
}
