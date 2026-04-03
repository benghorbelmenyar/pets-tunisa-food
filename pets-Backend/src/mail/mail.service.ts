import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.MAIL_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD, // Changed from MAIL_PASS to MAIL_PASSWORD
      },
    });
  }

  async sendResetCode(to: string, code: string) {
    await this.transporter.sendMail({
      from: `"Support" <${process.env.MAIL_USER}>`,
      to,
      subject: 'Réinitialisation de votre mot de passe',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
          <h2>Réinitialisation du mot de passe</h2>
          <p>Voici votre code de vérification. Il expire dans <strong>15 minutes</strong>.</p>
          <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px;
                      background: #f4f4f4; padding: 20px; text-align: center;
                      border-radius: 8px; color: #333;">
            ${code}
          </div>
          <p style="color: #888; margin-top: 16px;">
            Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
          </p>
        </div>
      `,
    });
  }
}