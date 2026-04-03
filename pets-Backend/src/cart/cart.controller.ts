import { Controller, Get, Post, Body, Param, Delete, Headers, UseGuards, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartItemDto } from './dto/cart-item.dto';
import { SyncCartDto } from './dto/sync-cart.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { ApiTags, ApiOperation, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Get()
    @UseGuards(OptionalJwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current cart (pass x-session-id for anonymous users, or Bearer token for logged in)' })
    @ApiHeader({ name: 'x-session-id', required: false })
    async getCart(@Req() req: Request, @Headers('x-session-id') sessionId: string) {
        const userId = (req.user as any)?._id?.toString();
        return this.cartService.getCart(userId, sessionId);
    }

    @Post('add')
    @UseGuards(OptionalJwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Add an item to the cart' })
    @ApiHeader({ name: 'x-session-id', required: false })
    async addItem(@Body() cartItemDto: CartItemDto, @Req() req: Request, @Headers('x-session-id') sessionId: string) {
        try {
            const userId = (req.user as any)?._id?.toString();
            return await this.cartService.addItem(cartItemDto, userId, sessionId);
        } catch (e: any) {
            require('fs').writeFileSync('cart_error.log', e.stack || e.toString());
            throw e;
        }
    }

    @Delete('remove/:productId')
    @UseGuards(OptionalJwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Remove an item from the cart' })
    @ApiHeader({ name: 'x-session-id', required: false })
    async removeItem(@Param('productId') productId: string, @Req() req: Request, @Headers('x-session-id') sessionId: string) {
        const userId = (req.user as any)?._id?.toString();
        return this.cartService.removeItem(productId, userId, sessionId);
    }

    @Post('sync')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Sync an anonymous cart with logged in user cart' })
    async syncCart(@Body() syncCartDto: SyncCartDto, @Req() req: Request) {
        const userId = (req.user as any)?._id?.toString();
        return this.cartService.syncCart(userId, syncCartDto.sessionId);
    }

    @Delete('clear')
    @UseGuards(OptionalJwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Clear the cart' })
    @ApiHeader({ name: 'x-session-id', required: false })
    async clearCart(@Req() req: Request, @Headers('x-session-id') sessionId: string) {
        const userId = (req.user as any)?._id?.toString();
        return this.cartService.clearCart(userId, sessionId);
    }
}
