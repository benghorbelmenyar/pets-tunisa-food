import { IsNotEmpty, IsString, IsNumber, IsOptional, IsArray, IsMongoId } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    @IsMongoId()
    @IsNotEmpty()
    category: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    price: number;

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    stock?: number;

    @ApiPropertyOptional({ type: [String] })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    images?: string[];
}
