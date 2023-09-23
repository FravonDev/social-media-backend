// src/services/NodemailerMailService.ts

import nodemailer from 'nodemailer';
import { MailService } from './mail.service';
import { MailRequest } from './interfaces/mail';

export class NodemailerMailService implements MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configurar o transporte do Nodemailer (configure as opções conforme necessário)
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'seu-email@gmail.com',
        pass: 'sua-senha',
      },
    });
  }

  async sendMail(request: MailRequest): Promise<void> {
    // Configurar a mensagem de e-mail
    const mailOptions: nodemailer.SendMailOptions = {
      from: 'seu-email@gmail.com',
      to: request.to,
      subject: request.subject,
      text: request.text,
    };

    try {
      // Enviar o e-mail
      await this.transporter.sendMail(mailOptions);
      console.log(`E-mail enviado para: ${request.to}`);
    } catch (error) {
      console.error(`Erro ao enviar e-mail: ${error}`);
      throw error;
    }
  }
}
