import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetFilmDto } from '../films/dto/films.dto';
import { CreateTicketDto, CreateOrdersDto } from '../order/dto/order.dto';
import { Film } from '../films/films.schema';
import { Order } from '../order/order.schema';
import { faker } from '@faker-js/faker';

@Injectable()
export class MongodbRepository {
  constructor(
    @InjectModel(Film.name) private filmModel: Model<Film>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  filmsFindAll(): Promise<GetFilmDto[]> {
    return this.filmModel.find();
  }

  findFilmById(id: string): Promise<GetFilmDto> {
    return this.filmModel.findOne({ id: id });
  }

  async updateFilmScheduleById(
    tickets: CreateTicketDto[],
    films: GetFilmDto[],
  ) {
    for (const ticket of tickets) {
      const taken = `${ticket.row}:${ticket.seat}`;
      const filmItem = films.find((item) => item.id === ticket.film);
      filmItem.schedule.forEach((element) => {
        if (
          element.id === ticket.session &&
          element.daytime === ticket.daytime
        ) {
          element.taken.push(taken);
        }
      });
      await this.filmModel.updateOne(
        { id: ticket.film },
        { $set: { schedule: filmItem.schedule } },
      );
    }
  }

  async createOrder(
    order: Omit<CreateOrdersDto, 'id'>,
  ): Promise<CreateOrdersDto> {
    const ticketsWithId = order.tickets.map((ticket) => ({
      ...ticket,
      id: faker.string.uuid(),
    }));

    const newOrder = new this.orderModel({
      id: faker.string.uuid(),
      email: order.email,
      phone: order.phone,
      tickets: ticketsWithId,
    });

    const savedOrder = await newOrder.save();

    return {
      id: savedOrder.id,
      email: savedOrder.email,
      phone: savedOrder.phone,
      tickets: savedOrder.tickets.map((ticket) => ({
        id: ticket.id,
        film: ticket.film,
        session: ticket.session,
        daytime: ticket.daytime,
        row: ticket.row,
        seat: ticket.seat,
        price: ticket.price,
      })),
    };
  }

  async findOrderByTicketDetails(
    tickets: CreateTicketDto[],
  ): Promise<CreateOrdersDto[]> {
    const orders = [];

    for (const ticket of tickets) {
      const existingOrders = await this.orderModel.find({
        'tickets.film': ticket.film,
        'tickets.daytime': ticket.daytime,
        'tickets.row': ticket.row,
        'tickets.seat': ticket.seat,
      });

      orders.push(
        ...existingOrders.map((order) => ({
          id: order.id,
          email: order.email,
          phone: order.phone,
          tickets: order.tickets.map((t) => ({
            id: t.id,
            film: t.film,
            session: t.session,
            daytime: t.daytime,
            row: t.row,
            seat: t.seat,
            price: t.price,
          })),
        })),
      );
    }

    return orders;
  }
}
