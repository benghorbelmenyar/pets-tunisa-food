import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Category } from '../../categories/schemas/category.schema';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', required: true })
    category: Category;

    @Prop({ required: true })
    price: number;

    @Prop()
    oldPrice: number;

    @Prop({ default: false })
    isPromo: boolean;

    @Prop({ default: 0 })
    stock: number;

    @Prop({ type: [String] })
    images: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
