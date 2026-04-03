import { IsMongoId, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CartItemDto {
    @ApiProperty()
    @IsMongoId()
    @IsNotEmpty()
    productId: string;

    @ApiProperty()
    @IsNumber()
    quantity: number;
}
