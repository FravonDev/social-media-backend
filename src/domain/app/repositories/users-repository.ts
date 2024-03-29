import { User, UserSummary } from '../entities/user';

export abstract class UsersRepository {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByUsername(username: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByToken(token: string): Promise<User | null>;
  abstract findManyUsersWithPagination(
    query: string,
    offset: number,
    limit: number,
  ): Promise<UserSummary[]>;

  abstract create(user: User): Promise<void>;
  abstract save(user: User): Promise<void>;
}
