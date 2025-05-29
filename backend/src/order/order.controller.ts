import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrdersDto, ReturnError, ReturnOrdersDto } from './dto/order.dto';

@Controller('/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/')
  create(
    @Body() createOrderDto: CreateOrdersDto,
  ): Promise<ReturnOrdersDto | ReturnError> {
    return this.orderService.createOrder(createOrderDto);
  }
}
