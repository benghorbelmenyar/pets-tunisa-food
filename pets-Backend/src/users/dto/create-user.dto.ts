import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../entities/role.enum';

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ enum: Role, required: false })
    @IsOptional()
    @IsEnum(Role)
    role?: Role;
}
