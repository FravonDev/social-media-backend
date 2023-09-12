import { User } from '@/app/entities/user';
import { UsersRepository } from '@/app/repositories/users-repository';

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = [];

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
