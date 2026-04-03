import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Product } from '../../products/schemas/product.schema';

export type CartDocument = Cart & Document;

@Schema()
export class CartItem {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
    product: Product;

    @Prop({ required: true, default: 1 })
    quantity: number;
}
export const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema({ timestamps: true })
export class Cart {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    userId?: string;

    @Prop({ index: true })
    sessionId?: string;

    @Prop({ type: [CartItemSchema], default: [] })
    items: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
