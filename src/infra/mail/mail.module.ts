import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { NodemailerMailService } from './nodemail.service';

@Module({
  imports: [],
  providers: [
    {
      provide: MailService,
      useClass: NodemailerMailService,
    },
  ],
  exports: [MailService],
})
export class MailModule {}
