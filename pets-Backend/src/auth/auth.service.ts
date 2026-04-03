import { Injectable, UnauthorizedException ,BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyResetCodeDto } from './dto/verify-reset-code.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
          private mailService: MailService,   // ← ajouter

    ) { }

    async validateUser(loginDto: LoginDto): Promise<any> {
        const user = await this.usersService.findOneByEmail(loginDto.email);
        if (user && await bcrypt.compare(loginDto.password, user.passwordHash)) {
            const { passwordHash, ...result } = user.toObject();
            return result;
        }
        return null;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { email: user.email, sub: user._id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }

    async register(createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }
    // ─── Forgot Password ────────────────────────────────────────────────
async forgotPassword(dto: ForgotPasswordDto) {
  const user = await this.usersService.findOneByEmail(dto.email);

  // On répond toujours OK pour ne pas exposer si l'email existe
  if (!user) {
    return { message: 'Si cet email existe, un code a été envoyé.' };
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 chiffres
  const expiry = new Date(Date.now() + 15 * 60 * 1000); // +15 min

  await this.usersService.setResetCode(dto.email, code, expiry);
  await this.mailService.sendResetCode(dto.email, code);

  return { message: 'Si cet email existe, un code a été envoyé.' };
}

// ─── Verify Code ────────────────────────────────────────────────────
async verifyResetCode(dto: VerifyResetCodeDto) {
  const user = await this.usersService.findOneByEmail(dto.email);

  if (!user || !user.resetCode || !user.resetCodeExpiry) {
    throw new BadRequestException('Code invalide ou expiré.');
  }

  if (user.resetCode !== dto.code) {
    throw new BadRequestException('Code incorrect.');
  }

  if (new Date() > user.resetCodeExpiry) {
    throw new BadRequestException('Code expiré. Veuillez en demander un nouveau.');
  }

  return { message: 'Code valide. Vous pouvez réinitialiser votre mot de passe.' };
}

// ─── Reset Password ─────────────────────────────────────────────────
async resetPassword(dto: ResetPasswordDto) {
  const user = await this.usersService.findOneByEmail(dto.email);

  if (!user || !user.resetCode || !user.resetCodeExpiry) {
    throw new BadRequestException('Demande invalide.');
  }

  if (user.resetCode !== dto.code) {
    throw new BadRequestException('Code incorrect.');
  }

  if (new Date() > user.resetCodeExpiry) {
    throw new BadRequestException('Code expiré.');
  }

  const newHash = await bcrypt.hash(dto.newPassword, 10);
  await this.usersService.updatePassword(dto.email, newHash);

  return { message: 'Mot de passe réinitialisé avec succès.' };
}
}
