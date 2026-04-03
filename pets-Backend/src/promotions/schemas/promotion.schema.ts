import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Product } from '../../products/schemas/product.schema';

export type PromotionDocument = Promotion & Document;

@Schema({ timestamps: true })
export class Promotion {
    @Prop({ required: true })
    title: string;

    @Prop()
    description: string;

    @Prop({ required: true, min: 0, max: 100 })
    discountPercentage: number;

    @Prop({ required: true })
    startDate: Date;

    @Prop({ required: true })
    endDate: Date;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Product' }], default: [] })
    applicableProducts: Product[];
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);
