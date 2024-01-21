import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DomainEvent } from '@/core/events/domain-event';
import { User } from '../entities/user';

export class UserCreatedEvent implements DomainEvent {
  public ocurredAt: Date;
  public user: User;

  constructor(user: User) {
    this.user = user;
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.user.id;
  }
}
