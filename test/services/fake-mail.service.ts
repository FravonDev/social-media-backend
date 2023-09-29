import { MailRequest } from '@/infra/mail/interfaces/mail';
import { MailService } from '@/infra/mail/mail.service';

export class FakeMailService implements MailService {
  private sentEmails: MailRequest[] = [];

  async sendMail(request: MailRequest): Promise<void> {
    const { to, subject, html } = request;
    this.sentEmails.push({ to, subject, html });
  }

  async getSentEmails(): Promise<MailRequest[]> {
    return this.sentEmails;
  }

  async clearSentEmails(): Promise<void> {
    this.sentEmails = [];
  }
}
