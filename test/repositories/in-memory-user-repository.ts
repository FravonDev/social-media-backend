import { DomainEvents } from '@/core/events/domain-events';
import { User, UserSummary } from '@/domain/app/entities/user';
import { UsersRepository } from '@/domain/app/repositories/users-repository';

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = [];

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((item) => item.id.toString() === id);
    if (!user) {
      return null;
    }
    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = this.users.find((item) => item.username === username);
    if (!user) {
      return null;
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((item) => item.email === email);
    if (!user) {
      return null;
    }
    return user;
  }

  async findByToken(token: string): Promise<User | null> {
    const user = this.users.find((item) => item.token === token);
    if (!user) {
      return null;
    }
    return user;
  }

  async findManyUsersWithPagination(
    query: string,
    offset: number,
    limit: number,
  ): Promise<UserSummary[]> {
    const filteredUsers = this.users.filter(
      (user) =>
        user.username.toLowerCase().includes(query.toLowerCase()) ||
        user.name.toLowerCase().includes(query.toLowerCase()),
    );

    const paginatedUsers = filteredUsers.slice(offset, offset + limit);

    const usersSummary = paginatedUsers.map((user) => user.getSummary());

    return usersSummary;
  }

  async create(user: User): Promise<void> {
    this.users.push(user);

    DomainEvents.dispatchEventsForAggregate(user.id);
  }

  async save(user: User): Promise<void> {
    const index = this.users.findIndex((item) => item.id === user.id);
    this.users[index] = user;

    DomainEvents.dispatchEventsForAggregate(user.id);
  }
}
