// dto/reset-password.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '482931' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'NewPassword123!' })
  @IsString()
  @MinLength(6)
  newPassword: string;
}