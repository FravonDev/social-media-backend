import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DomainEvent } from '@/core/events/domain-event';
import { User } from '../entities/user';

export class UserCreatedEvent implements DomainEvent {
  ocurredAt: Date;
  public user: User;
  constructor(user: User) {
    this.ocurredAt = new Date();
    this.user = user;
  }

  getAggregateId(): UniqueEntityID {
    return this.user.id;
  }
}
