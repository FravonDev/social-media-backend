import { DomainEvents } from '@/core/events/domain-events';
import { UserCreatedEvent } from '@/domain/app/events/user-created-event';
import { MailService } from '@/infra/mail/mail.service';
import { UsersRepository } from '@/domain/app/repositories/users-repository';
import { EventHandler } from '@/core/events/event-handler';

export class OnUserCreated implements EventHandler {
  constructor(
    private readonly mailService: MailService,
    private readonly usersRepository: UsersRepository,
  ) {}
  setupSubscriptions(): void {
    //create a subscriber
    DomainEvents.register(() => {
      this.sendNewUserNotification.bind(this); //that way the  context is the same of the main class
    }, UserCreatedEvent.name);
  }

  private async sendNewUserNotification({ user }: UserCreatedEvent) {
    console.log('send email');
    console.log(user);
    const exitsUser = await this.usersRepository.findById(user.id.toString());

    if (exitsUser) {
      if (!user.emailVerifiedAt) {
        //Logic to send notification
      }
    }
  }
}
