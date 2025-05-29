import { Injectable } from '@nestjs/common';
import { CreateOrdersDto } from 'src/order/dto/order.dto';
import { DatabaseRepository } from 'src/database/database.repository';

@Injectable()
export class OrdersRepository {
  constructor(private databaseRepository: DatabaseRepository) {}

  async createOrder(
    order: Omit<CreateOrdersDto, 'id'>,
  ): Promise<CreateOrdersDto> {
    const existingOrders =
      await this.databaseRepository.findOrderByTicketDetails(order.tickets);

    // Create a Set of Existing Ticket Keys for ~O(1) Lookup
    const existingTicketKeys = new Set<string>();

    existingOrders.forEach((existingOrder) => {
      existingOrder.tickets.forEach((existingTicket) => {
        const ticketKey = `${existingTicket.film}:${existingTicket.daytime}:${existingTicket.row}:${existingTicket.seat}`;
        existingTicketKeys.add(ticketKey);
      });
    });

    // Check for conflicts in O(n)
    for (const ticket of order.tickets) {
      const ticketKey = `${ticket.film}:${ticket.daytime}:${ticket.row}:${ticket.seat}`;

      if (existingTicketKeys.has(ticketKey)) {
        throw new Error('Билеты с такими данными уже существует');
      }
    }

    return await this.databaseRepository.createOrder(order);
  }
}
