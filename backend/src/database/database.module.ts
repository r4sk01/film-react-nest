import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseRepository } from './database.repository';
import { Films } from 'src/films/film.entity';
import { Schedules } from 'src/films/schedule.entity';
import { Orders } from 'src/order/order.entity';
import { Ticket } from 'src/order/ticket.entity';
import { OrderController } from 'src/order/order.controller';
import { FilmsController } from 'src/films/films.controller';
import { OrdersRepository } from 'src/order/orders.repository';
import { OrderService } from 'src/order/order.service';
import { FilmsRepository } from 'src/films/films.repository';
import { FilmsService } from 'src/films/films.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Film, FilmSchema } from 'src/films/films.schema';
import { Order, OrderSchema } from 'src/order/order.schema';
import { PostgresRepository } from './postgresql.repository';
import { MongodbRepository } from './mongodb.repository';

@Module({})
export class DatabaseModule {
  static forRootAsync(): DynamicModule {
    const databaseType = process.env.DATABASE_DRIVER || 'mongodb';
    const databaseImports = [];
    const databaseProviders = [];
    databaseProviders.push(
      OrdersRepository,
      OrderService,
      FilmsRepository,
      FilmsService,
      DatabaseRepository,
    );
    switch (databaseType) {
      case 'postgres':
        databaseImports.push(
          TypeOrmModule.forFeature([Films, Schedules, Orders, Ticket]),
          TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
              type: 'postgres',
              host: config.get<string>('database.url'),
              port: config.get<number>('database.port'),
              username: config.get<string>('database.username'),
              password: config.get<string>('database.password'),
              database: config.get<string>('database.name'),
              entities: [Films, Schedules, Orders, Ticket],
              synchronize: false,
            }),
            inject: [ConfigService],
          }),
        );
        databaseProviders.push(PostgresRepository);
        break;
      case 'mongodb':
        databaseImports.push(
          MongooseModule.forFeature([
            {
              name: Film.name,
              schema: FilmSchema,
            },
            {
              name: Order.name,
              schema: OrderSchema,
            },
          ]),
          MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => {
              return {
                uri: `mongodb://${config.get<string>('database.url')}:${config.get<number>('database.port')}/${config.get<string>('database.name')}`,
              };
            },
            inject: [ConfigService],
          }),
        );
        databaseProviders.push(MongodbRepository);
        break;
    }
    return {
      module: DatabaseModule,
      imports: databaseImports,
      providers: databaseProviders,
      controllers: [OrderController, FilmsController],
    };
  }
}
