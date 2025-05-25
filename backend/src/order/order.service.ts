import { Injectable } from '@nestjs/common';
import { FilmsRepository } from 'src/repository/films.repository';
import { CreateOrdersDto, ReturnError, ReturnOrdersDto } from './dto/order.dto';
import { OrdersRepository } from 'src/repository/orders.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly filmsRepository: FilmsRepository,
    private readonly ordersRepository: OrdersRepository,
  ) {}

  async createOrder(
    createOrderDto: Omit<CreateOrdersDto, 'id'>,
  ): Promise<ReturnOrdersDto | ReturnError> {
    try {
      // 1) fetch all films in one go
      const filmIds = [...new Set(createOrderDto.tickets.map((t) => t.film))];
      const films = await this.filmsRepository.findByIds(filmIds);

      // 2) validate each ticket’s seat
      for (const ticket of createOrderDto.tickets) {
        const film = films.find((f) => f.id === ticket.film);
        if (!film) throw new Error(`Film ${ticket.film} not found`);

        const schedule = film.schedule.find(
          (s) => s.id === ticket.session && s.daytime === ticket.daytime,
        );
        if (!schedule)
          throw new Error(
            `Session ${ticket.session} not found for film ${ticket.film}`,
          );

        const seatKey = `${ticket.row}:${ticket.seat}`;
        if (schedule.taken.includes(seatKey))
          throw new Error('Seat already taken');
      }

      // 3) create the order
      const savedOrder =
        await this.ordersRepository.createOrder(createOrderDto);

      // 4) atomically push each seat into the film document
      await Promise.all(
        createOrderDto.tickets.map((ticket) => {
          const seatKey = `${ticket.row}:${ticket.seat}`;
          return this.filmsRepository.updateScheduleSeat(
            ticket.film,
            ticket.session,
            seatKey,
          );
        }),
      );

      // 5) return
      return {
        total: savedOrder.tickets.length,
        items: savedOrder.tickets.map((t) => ({
          film: t.film.toString(),
          session: t.session,
          daytime: t.daytime,
          row: t.row,
          seat: t.seat,
          price: t.price,
        })),
      };
    } catch (e) {
      return { error: e.message };
    }
  }
}
