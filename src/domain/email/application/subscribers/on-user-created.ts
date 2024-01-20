import { DomainEvents } from '@/core/events/domain-events';
import { UserCreatedEvent } from '@/domain/app/events/user-created-event';
import { MailService } from '@/infra/mail/mail.service';
import { UsersRepository } from '@/domain/app/repositories/users-repository';
import { EventHandler } from '@/core/events/event-handler';
import { SendConfirmationEmailUseCase } from '../use-cases/send-confirmation-email';

export class OnUserCreated implements EventHandler {
  constructor(
    private readonly sendConfirmationEmail: SendConfirmationEmailUseCase,
    private readonly usersRepository: UsersRepository,
  ) {}
  setupSubscriptions(): void {
    //create a subscriber
    DomainEvents.register(() => {
      this.sendNewUserEmail.bind(this); //that way the  context is the same of the main class
    }, UserCreatedEvent.name);
  }

  private async sendNewUserEmail({ user }: UserCreatedEvent) {
    console.log('send email');
    console.log(user);
    const exitsUser = await this.usersRepository.findById(user.id.toString());

    if (exitsUser) {
      if (!user.emailVerifiedAt) {
        await this.sendConfirmationEmail.execute(user);
      }
    }
  }
}
