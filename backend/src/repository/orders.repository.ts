import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './orders.schema';
import { CreateOrdersDto } from 'src/order/dto/order.dto';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async createOrder(
    orderDto: Omit<CreateOrdersDto, 'id'>,
  ): Promise<OrderDocument> {
    const order = new this.orderModel(orderDto);
    return order.save();
  }
}
