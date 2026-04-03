import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderDto {
    @ApiPropertyOptional({ description: 'Session ID for anonymous checkout' })
    @IsString()
    @IsOptional()
    sessionId?: string;

    @ApiPropertyOptional({ description: 'Checkout form details for guests or logged-in users' })
    @IsOptional()
    customerInfo?: {
        firstName: string;
        lastName: string;
        address: string;
        phone: string;
    };
}
