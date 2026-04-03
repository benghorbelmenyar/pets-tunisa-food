import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument, OrderStatus } from './schemas/order.schema';
import { Model } from 'mongoose';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
        private cartService: CartService,
        private productsService: ProductsService,
        private notificationsService: NotificationsService,
    ) { }

    async createOrder(userId?: string, sessionId?: string, customerInfo?: any) {
        const cart = await this.cartService.getCart(userId, sessionId);
        if (!cart || cart.items.length === 0) {
            throw new BadRequestException('Cart is empty');
        }

        let total = 0;
        for (const item of cart.items) {
            const price = (item.product as any).price || 0;
            total += price * item.quantity;

            // Decrement stock immediately
            try {
                const productId = typeof item.product === 'string' ? item.product : (item.product as any)._id;
                const product = await this.productsService.findOne(productId.toString());
                if (product) {
                    const newStock = Math.max(0, product.stock - item.quantity);
                    await this.productsService.update(productId.toString(), { stock: newStock });
                }
            } catch (err) {
                console.error('Failed to update stock for product', err);
            }
        }

        const newOrder = new this.orderModel({
            userId,
            sessionId,
            customerInfo,
            items: cart.items,
            total,
            status: OrderStatus.PENDING,
        });

        await newOrder.save();
        await this.cartService.clearCart(userId, sessionId);

        return newOrder;
    }

    async findAll(query: any, userId?: string, role?: string) {
        const filters: any = {};
        if (query.status) filters.status = query.status;
        if (query.sessionId) filters.sessionId = query.sessionId;

        if (role !== 'admin' && userId) {
            filters.userId = userId;
        } else if (role !== 'admin' && !userId && query.sessionId) {
            filters.sessionId = query.sessionId;
        } else if (role !== 'admin' && !userId && !query.sessionId) {
            throw new BadRequestException('Must provide sessionId for anonymous orders');
        }

        return this.orderModel.find(filters).populate('items.product').exec();
    }

    async updateStatus(id: string, status: OrderStatus) {
        const order = await this.orderModel.findById(id).exec();
        if (!order) {
            throw new NotFoundException('Order not found');
        }

        // If order shifts to CANCELLED, restock
        if (order.status !== OrderStatus.CANCELLED && status === OrderStatus.CANCELLED) {
            for (const item of order.items) {
                const productId = typeof item.product === 'string' ? item.product : (item.product as any)._id;
                try {
                    const product = await this.productsService.findOne(productId.toString());
                    if (product) {
                        await this.productsService.update(productId.toString(), { stock: product.stock + item.quantity });
                    }
                } catch (err) {
                    console.error('Failed to restock product', productId, err);
                }
            }
        }

        // If shifting to COMPLETED, "notify" user
        if (order.status !== OrderStatus.COMPLETED && status === OrderStatus.COMPLETED) {
            const productNames: string[] = [];
            for (const item of order.items) {
                const productId = typeof item.product === 'string' ? item.product : (item.product as any)._id;
                try {
                    const product = await this.productsService.findOne(productId.toString());
                    if (product) {
                        productNames.push(product.name);
                    }
                } catch (err) {
                    console.error('Failed to get product name', productId, err);
                }
            }

            const orderName = productNames.length > 0
                ? (productNames.length > 2 ? `${productNames[0]}, ${productNames[1]} et autres` : productNames.join(', '))
                : 'Articles';

            // Generate in-app notification
            await this.notificationsService.create({
                userId: order.userId,
                sessionId: order.sessionId,
                title: 'Commande Confirmée !',
                message: `Votre commande pour "${orderName}" a été acceptée et est en cours de préparation.`
            }).catch(e => console.error('Failed to create notification', e));
        }

        order.status = status;
        await order.save();
        return order;
    }

    async deleteOrder(id: string) {
        const order = await this.orderModel.findByIdAndDelete(id);
        if (!order) throw new NotFoundException('Order not found');
        return order;
    }
}
