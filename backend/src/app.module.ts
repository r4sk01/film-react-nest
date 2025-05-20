import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'node:path';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Film, FilmSchema } from './repository/films.schema';
import { Order, OrderSchema } from './repository/orders.schema';
import { FilmsController } from './films/films.controller';
import { FilmsRepository } from './repository/films.repository';
import { FilmsService } from './films/films.service';
import { OrdersRepository } from './repository/orders.repository';
import { configProvider } from './app.config.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configProvider],
      isGlobal: true,
      cache: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return {
          uri: config.get<string>('database.url'),
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: Film.name,
        schema: FilmSchema,
      },
    ]),
    MongooseModule.forFeature([
      { name: Film.name, schema: FilmSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  controllers: [OrderController, FilmsController],
  providers: [OrdersRepository, OrderService, FilmsRepository, FilmsService],
})
export class AppModule {}
