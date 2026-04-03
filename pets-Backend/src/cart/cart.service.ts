import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { Model } from 'mongoose';
import { CartItemDto } from './dto/cart-item.dto';

@Injectable()
export class CartService {
    constructor(@InjectModel(Cart.name) private cartModel: Model<CartDocument>) { }

    async getCart(userId?: string, sessionId?: string): Promise<CartDocument> {
        const query = userId ? { userId } : { sessionId };
        let cart = await this.cartModel.findOne(query).populate('items.product').exec();

        if (cart) {
            // Clean up any items where the product was deleted from the database
            const validItems = cart.items.filter((item: any) => item.product != null);
            if (validItems.length !== cart.items.length) {
                cart.items = validItems;
                await cart.save();
            }
        }

        if (!cart) {
            cart = new this.cartModel(query);
            await cart.save();
        }
        return cart;
    }

    async addItem(cartItemDto: CartItemDto, userId?: string, sessionId?: string) {
        const cart = await this.getCart(userId, sessionId);

        const existingItemIndex = cart.items.findIndex(
            (item: any) => item.product?._id?.toString() === cartItemDto.productId || item.product?.toString() === cartItemDto.productId
        );

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += cartItemDto.quantity;
            if (cart.items[existingItemIndex].quantity <= 0) {
                cart.items.splice(existingItemIndex, 1);
            }
        } else {
            if (cartItemDto.quantity > 0) {
                cart.items.push({
                    product: cartItemDto.productId as any,
                    quantity: cartItemDto.quantity,
                });
            }
        }

        await cart.save();
        return this.cartModel.findById(cart._id).populate('items.product').exec();
    }

    async removeItem(productId: string, userId?: string, sessionId?: string) {
        const cart = await this.getCart(userId, sessionId);
        cart.items = cart.items.filter(
            (item: any) => item.product?._id?.toString() !== productId && item.product?.toString() !== productId
        );
        await cart.save();
        return this.cartModel.findById(cart._id).populate('items.product').exec();
    }

    async syncCart(userId: string, sessionId?: string) {
        if (!sessionId) return this.getCart(userId);

        const sessionCart = await this.cartModel.findOne({ sessionId }).exec();
        const userCart = await this.getCart(userId);

        if (sessionCart && sessionCart.items.length > 0) {
            for (const item of sessionCart.items) {
                const existing = userCart.items.find((i: any) => i.product?.toString() === item.product?.toString() || (i.product as any)?._id?.toString() === (item.product as any)?._id?.toString());
                if (existing) {
                    existing.quantity += item.quantity;
                } else {
                    userCart.items.push(item);
                }
            }
            await userCart.save();
            await this.cartModel.deleteOne({ _id: sessionCart._id }).exec();
        }

        return this.getCart(userId);
    }

    async clearCart(userId?: string, sessionId?: string) {
        const cart = await this.getCart(userId, sessionId);
        cart.items = [];
        await cart.save();
        return cart;
    }
}
