import { User } from '../entities/user';

export abstract class UsersRepository {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByUsername(username: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByToken(token: string): Promise<User | null>;

  abstract findConfirmedByEmail(email: string): Promise<User | null>;
  abstract findConfirmedByUsername(username: string): Promise<User | null>;
  abstract findConfirmedById(id: string): Promise<User | null>;

  abstract create(user: User): Promise<void>;
  abstract save(user: User): Promise<void>;
}
