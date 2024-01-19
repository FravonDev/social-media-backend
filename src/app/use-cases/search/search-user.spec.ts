import { makeUser } from '@test/factories/make-user';
import { SearchUsersUseCase } from './search-user';
import { InMemoryUsersRepository } from '@test/repositories/in-memory-user-repository';

let inMemoryUsersRepository: InMemoryUsersRepository;
let searchUsersUseCase: SearchUsersUseCase;

describe('Search user with pagination', () => {
  beforeAll(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    searchUsersUseCase = new SearchUsersUseCase(inMemoryUsersRepository);

    const users = [
      makeUser({
        name: 'Jhonny J.',
      }),
      makeUser({
        name: 'Jhonatan J.',
      }),
      makeUser({
        name: 'Sarah S.',
      }),
      makeUser({
        name: 'Jhon D.',
      }),
      makeUser({
        name: 'Sara A.',
      }),
    ];
    users.forEach((user) => inMemoryUsersRepository.users.push(user));
  });

  it('should return users with pagination', async () => {
    const result = await searchUsersUseCase.execute({
      query: 'Jh',
      offset: 0,
      limit: 2,
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.usersSummary.length).toBe(2);
  });

  it('should return users with pagination and offset', async () => {
    const result = await searchUsersUseCase.execute({
      query: 'Jh',
      offset: 2,
      limit: 2,
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.usersSummary.length).toBe(1);
  });
});
