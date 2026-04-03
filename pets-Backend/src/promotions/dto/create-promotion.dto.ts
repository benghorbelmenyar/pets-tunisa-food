import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean, IsDateString, IsArray, IsMongoId, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePromotionDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    @Max(100)
    discountPercentage: number;

    @ApiProperty()
    @IsDateString()
    @IsNotEmpty()
    startDate: string;

    @ApiProperty()
    @IsDateString()
    @IsNotEmpty()
    endDate: string;

    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ApiPropertyOptional({ type: [String] })
    @IsArray()
    @IsMongoId({ each: true })
    @IsOptional()
    applicableProducts?: string[];
}
