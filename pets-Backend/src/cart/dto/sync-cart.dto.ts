import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SyncCartDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    sessionId?: string;
}
