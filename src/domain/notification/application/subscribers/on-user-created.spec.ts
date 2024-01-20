import { makeUser } from '@test/factories/make-user';
import { OnUserCreated } from './on-user-created';
import { InMemoryUsersRepository } from '@test/repositories/in-memory-user-repository';

let inMemoryUser: InMemoryUsersRepository;
describe('On User Created', () => {
  beforeEach(() => {
    inMemoryUser = new InMemoryUsersRepository();
  });
  it('should send a welcome email when user is created', async () => {
    const onUserCreated = new OnUserCreated();
    const user = makeUser();

    await inMemoryUser.create(user);
  });
});
