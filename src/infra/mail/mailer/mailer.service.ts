import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { MailRequest } from '../interfaces/mail';
import { MailService } from '../mail.service';

@Injectable()
export class MailerTrapService implements MailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(request: MailRequest): Promise<void> {
    const { to, subject, context, html, template } = request;

    const mailOptions = {
      to,
      subject,
      context,
      html,
      template,
    };
    await this.mailerService.sendMail(mailOptions);
  }

  async sendConfirmationEmail(email: string, code: string): Promise<void> {
    const mailOptions = {
      to: email,
      subject: 'Your code - account confirmation',
      context: {
        code,
      },
      template: './confirmation',
    };
    await this.mailerService.sendMail(mailOptions);
  }
}
