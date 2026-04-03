import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyResetCodeDto } from './dto/verify-reset-code.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login client or admin' })
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user (admin or client)' })
    register(@Body() createUserDto: CreateUserDto) {
        // En développement, on permet de définir le rôle
        return this.authService.register(createUserDto);
    }
    @Post('forgot-password')
@HttpCode(HttpStatus.OK)
@ApiOperation({ summary: 'Envoyer un code de réinitialisation par email' })
forgotPassword(@Body() dto: ForgotPasswordDto) {
  return this.authService.forgotPassword(dto);
}

@Post('verify-reset-code')
@HttpCode(HttpStatus.OK)
@ApiOperation({ summary: 'Vérifier le code reçu par email' })
verifyResetCode(@Body() dto: VerifyResetCodeDto) {
  return this.authService.verifyResetCode(dto);
}

@Post('reset-password')
@HttpCode(HttpStatus.OK)
@ApiOperation({ summary: 'Réinitialiser le mot de passe' })
resetPassword(@Body() dto: ResetPasswordDto) {
  return this.authService.resetPassword(dto);
}
}
