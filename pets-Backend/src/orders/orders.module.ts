import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { CartModule } from '../cart/cart.module';
import { ProductsModule } from '../products/products.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    CartModule,
    ProductsModule,
    NotificationsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule { }
