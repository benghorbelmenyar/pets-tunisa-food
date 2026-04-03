import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { CartItem, CartItemSchema } from '../../cart/schemas/cart.schema';

export type OrderDocument = Order & Document;

export enum OrderStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

@Schema({ timestamps: true })
export class Order {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    userId?: string;

    @Prop({ index: true })
    sessionId?: string;

    @Prop({ type: Object })
    customerInfo?: {
        firstName: string;
        lastName: string;
        address: string;
        phone: string;
    };

    @Prop({ type: [CartItemSchema], required: true })
    items: CartItem[];

    @Prop({ required: true })
    total: number;

    @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
    status: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
