import { Controller, Post, Get, Patch, Body, Query, Param, Headers, Req, UseGuards, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './schemas/order.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/entities/role.enum';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiHeader, ApiQuery } from '@nestjs/swagger';
import type { Request } from 'express';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @UseGuards(OptionalJwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create an order from cart' })
    @ApiHeader({ name: 'x-session-id', required: false })
    createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req: Request, @Headers('x-session-id') sessionId: string) {
        const userId = (req.user as any)?._id?.toString();
        const activeSessionId = createOrderDto.sessionId || sessionId;
        return this.ordersService.createOrder(userId, activeSessionId, createOrderDto.customerInfo);
    }

    @Get()
    @UseGuards(OptionalJwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get orders' })
    @ApiQuery({ name: 'status', required: false, enum: OrderStatus })
    @ApiQuery({ name: 'sessionId', required: false })
    findAll(@Query() query: any, @Req() req: Request) {
        const userId = (req.user as any)?._id?.toString();
        const currentRole = (req.user as any)?.role;
        return this.ordersService.findAll(query, userId, currentRole);
    }

    @Patch(':id/status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update order status (Admin only)' })
    updateStatus(@Param('id') id: string, @Body('status') status: OrderStatus) {
        return this.ordersService.updateStatus(id, status);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete order (Admin only)' })
    deleteOrder(@Param('id') id: string) {
        return this.ordersService.deleteOrder(id);
    }
}
