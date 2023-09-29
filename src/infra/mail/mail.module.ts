import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerTrapService } from './mailer/mailer.service';
import { MailerDispatcherModule } from './mailer/mailer.module';

@Module({
  imports: [MailerDispatcherModule],
  providers: [
    {
      provide: MailService,
      useClass: MailerTrapService,
    },
  ],
  exports: [MailService],
})
export class MailModule {}
