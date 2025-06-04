import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class TicketSchema {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  film: string;

  @Prop({ required: true })
  session: string;

  @Prop({ required: true })
  daytime: string;

  @Prop({ required: true })
  row: number;

  @Prop({ required: true })
  seat: number;

  @Prop({ required: true })
  price: number;
}

@Schema()
export class Order {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  tickets: TicketSchema[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
