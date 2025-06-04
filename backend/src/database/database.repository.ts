import { Injectable, Optional } from '@nestjs/common';
import { GetFilmDto } from 'src/films/dto/films.dto';
import { CreateTicketDto, CreateOrdersDto } from 'src/order/dto/order.dto';
import { PostgresRepository } from './postgresql.repository';
import { MongodbRepository } from './mongodb.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseRepository {
  private databaseType: string;
  constructor(
    @Optional() private postgresRepository: PostgresRepository,
    @Optional() private mongodbRepository: MongodbRepository,
    private config: ConfigService,
  ) {
    this.databaseType = config.get<string>('database.driver');
  }

  async filmsFindAll(): Promise<GetFilmDto[]> {
    switch (this.databaseType) {
      case 'postgres':
        return await this.postgresRepository.filmsFindAll();
      case 'mongodb':
        return await this.mongodbRepository.filmsFindAll();
    }
  }

  async findFilmById(id: string): Promise<GetFilmDto> {
    switch (this.databaseType) {
      case 'postgres':
        return await this.postgresRepository.findFilmById(id);
      case 'mongodb':
        return await this.mongodbRepository.findFilmById(id);
    }
  }

  async updateFilmSchedules(tikets: CreateTicketDto[], films?: GetFilmDto[]) {
    switch (this.databaseType) {
      case 'postgres':
        return await this.postgresRepository.updateFilmSchedules(tikets);
      case 'mongodb':
        return await this.mongodbRepository.updateFilmScheduleById(
          tikets,
          films,
        );
    }
  }

  async createOrder(
    order: Omit<CreateOrdersDto, 'id'>,
  ): Promise<CreateOrdersDto> {
    switch (this.databaseType) {
      case 'postgres':
        return await this.postgresRepository.createOrder(order);
      case 'mongodb':
        return await this.mongodbRepository.createOrder(order);
    }
  }

  async findOrderByTicketDetails(
    tickets: CreateTicketDto[],
  ): Promise<CreateOrdersDto[]> {
    switch (this.databaseType) {
      case 'postgres':
        return await this.postgresRepository.findOrderByTicketDetails(tickets);
      case 'mongodb':
        return await this.mongodbRepository.findOrderByTicketDetails(tickets);
    }
  }
}
