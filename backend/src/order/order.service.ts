import { Injectable } from '@nestjs/common';
import { FilmsRepository } from 'src/films/films.repository';
import { CreateOrdersDto, ReturnError, ReturnOrdersDto } from './dto/order.dto';
import { OrdersRepository } from 'src/order/orders.repository';
import { GetFilmDto } from 'src/films/dto/films.dto';

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
      // Get Unique Film IDs
      const uniqueFilmIds = [
        ...new Set(createOrderDto.tickets.map((ticket) => ticket.film)),
      ];

      // Fetch Films in Parallel
      const films = await Promise.all(
        uniqueFilmIds.map((filmId) =>
          this.filmsRepository.findFilmById(filmId),
        ),
      );

      // Create a Map for ~O(1) Film Lookup
      const filmsMap = new Map<string, GetFilmDto>();
      films.forEach((film) => filmsMap.set(film.id, film));

      // Create a Map for ~O(1) Schedule Lookup
      const schedulesMap = new Map();
      films.forEach((film) => {
        film.schedule.forEach((schedule) => {
          schedulesMap.set(schedule.id, {
            ...schedule,
            filmId: film.id,
            takenSeatsSet: new Set(schedule.taken),
          });
        });
      });

      // Check Seat Availability in O(n)
      for (const ticket of createOrderDto.tickets) {
        const schedule = schedulesMap.get(ticket.session);

        if (!schedule) {
          throw new Error(`Schedule with ID ${ticket.session} not found`);
        }

        if (schedule.daytime !== ticket.daytime) {
          throw new Error(`Daytime mismatch for session ${ticket.session}`);
        }

        const seatKey = `${ticket.row}:${ticket.seat}`;
        if (schedule.takenSeatsSet.has(seatKey)) {
          throw new Error('Билеты с такими данными уже существует');
        }
      }

      const result = await this.ordersRepository.createOrder(createOrderDto);

      await this.filmsRepository.updateFilmSchedules(
        createOrderDto.tickets,
        films,
      );

      return {
        total: result.tickets.length,
        items: result.tickets,
      };
    } catch (e) {
      return { error: e.message };
    }
  }
}
