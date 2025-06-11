import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetFilmDto } from '../films/dto/films.dto';
import { Films } from '../films/film.entity';
import { Schedules } from '../films/schedule.entity';
import { Orders } from '../order/order.entity';
import { Ticket } from '../order/ticket.entity';
import { CreateTicketDto, CreateOrdersDto } from '../order/dto/order.dto';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

@Injectable()
export class PostgresRepository {
  constructor(
    @InjectRepository(Films)
    private filmsRepository: Repository<Films>,
    @InjectRepository(Schedules)
    private schedulesRepository: Repository<Schedules>,
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
  ) {}

  async filmsFindAll(): Promise<GetFilmDto[]> {
    const films = await this.filmsRepository.find({
      relations: {
        schedule: true,
      },
    });
    if (films.length === 0) {
      return [];
    }
    const newFilms = films.map((film) => {
      const newSchedules = [];
      film.schedule.forEach((schedule) => {
        newSchedules.push({
          ...schedule,
          taken: schedule.taken.length > 0 ? schedule.taken.split(',') : [],
        });
      });
      return {
        ...film,
        tags: film.tags.length > 0 ? film.tags.split(',') : [],
        schedule: newSchedules,
      };
    });
    return newFilms;
  }

  async findFilmById(id: string): Promise<GetFilmDto> {
    const film = await this.filmsRepository.find({
      where: { id: id },
      relations: {
        schedule: true,
      },
    });
    if (film.length > 0) {
      const newSchedules = [];
      film[0].schedule.forEach((schedule) => {
        newSchedules.push({
          ...schedule,
          taken: schedule.taken.length > 0 ? schedule.taken.split(',') : [],
        });
      });
      const newFilm = {
        ...film[0],
        tags: film[0].tags.length > 0 ? film[0].tags.split(',') : [],
        schedule: newSchedules,
      };
      return newFilm;
    }
  }

  async updateFilmSchedules(tikets: CreateTicketDto[]) {
    for (const ticket of tikets) {
      const taken = `${ticket.row}:${ticket.seat}`;
      const scheduleTakens = await this.schedulesRepository.findOneBy({
        id: ticket.session,
      });
      const scheduleTakensClearSpases = scheduleTakens.taken.trim();
      const newTaken =
        scheduleTakensClearSpases.length > 0
          ? scheduleTakensClearSpases + `,${taken}`
          : taken;
      await this.schedulesRepository.update(
        { id: ticket.session },
        { taken: newTaken },
      );
    }
  }

  async createOrder(
    order: Omit<CreateOrdersDto, 'id'>,
  ): Promise<CreateOrdersDto> {
    const newOrder = this.ordersRepository.create({
      id: faker.string.uuid(),
      email: order.email,
      phone: order.phone,
    });

    const savedOrder = await this.ordersRepository.save(newOrder);

    const ticketsWithId = [];
    for (const ticketData of order.tickets) {
      const ticket = this.ticketsRepository.create({
        id: faker.string.uuid(),
        film: ticketData.film,
        session: ticketData.session,
        daytime: ticketData.daytime,
        row: ticketData.row,
        seat: ticketData.seat,
        price: ticketData.price,
        order: savedOrder,
      });
      const savedTicket = await this.ticketsRepository.save(ticket);
      ticketsWithId.push({
        id: savedTicket.id,
        film: savedTicket.film,
        session: savedTicket.session,
        daytime: savedTicket.daytime,
        row: savedTicket.row,
        seat: savedTicket.seat,
        price: savedTicket.price,
      });
    }

    return {
      id: savedOrder.id,
      email: savedOrder.email,
      phone: savedOrder.phone,
      tickets: ticketsWithId,
    };
  }

  async findOrderByTicketDetails(
    tickets: CreateTicketDto[],
  ): Promise<CreateOrdersDto[]> {
    const orders = [];

    for (const ticket of tickets) {
      const existingTickets = await this.ticketsRepository.find({
        where: {
          film: ticket.film,
          daytime: ticket.daytime,
          row: ticket.row,
          seat: ticket.seat,
        },
        relations: ['order'],
      });

      for (const existingTicket of existingTickets) {
        const orderWithTickets = await this.ordersRepository.findOne({
          where: { id: existingTicket.order.id },
          relations: ['tickets'],
        });

        if (orderWithTickets) {
          const formattedOrder: CreateOrdersDto = {
            id: orderWithTickets.id,
            email: orderWithTickets.email,
            phone: orderWithTickets.phone,
            tickets: orderWithTickets.tickets.map((t) => ({
              id: t.id,
              film: t.film,
              session: t.session,
              daytime: t.daytime,
              row: t.row,
              seat: t.seat,
              price: t.price,
            })),
          };
          orders.push(formattedOrder);
        }
      }
    }

    return orders;
  }
}
