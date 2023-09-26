import { User } from '@/app/entities/user';
import { UsersRepository } from '@/app/repositories/users-repository';

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = [];

  async findByToken(token: string): Promise<User | null> {
    const user = this.users.find((item) => item.token === token);
    if (!user) {
      return null;
    }
    return user;
  }

  async save(user: User): Promise<void> {
    const index = this.users.findIndex((item) => item.id === user.id);
    this.users[index] = user;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((item) => item.id.toString() === id);
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

  async findByUsername(username: string): Promise<User | null> {
    const user = this.users.find((item) => item.username === username);
    if (!user) {
      return null;
    }
    return user;
  }

  async create(user: User): Promise<void> {
    this.users.push(user);
  }
}
