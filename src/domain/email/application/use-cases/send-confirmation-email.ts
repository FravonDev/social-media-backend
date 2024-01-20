import { User } from '@/domain/app/entities/user';
import { MailService } from '../../../../infra/mail/mail.service';

export class SendConfirmationEmailUseCase {
  constructor(private readonly mailService: MailService) {}
  async execute({ email, name, username, token }: User): Promise<void> {
    await this.mailService.sendMail({
      to: email,
      subject: 'Social Media - Confirm your email',
      template: 'user-created',
      context: {
        name,
        username,
        confirmationUrl: `${process.env.FRONTEND_CONFIRMATION_URL}/accounts/confirm?token=${token}`,
      },
    });
  }
}
