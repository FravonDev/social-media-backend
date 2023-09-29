import { Module } from '@nestjs/common';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        auth: {
          user: process.env.USER_MAIL,
          pass: process.env.USER_MAIL_PASSWORD,
        },
      },
      defaults: {
        from: process.env.USER_MAIL,
      },
      template: {
        dir: join(process.cwd(), '/dist/infra/mail/templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
})
export class MailerDispatcherModule {}
