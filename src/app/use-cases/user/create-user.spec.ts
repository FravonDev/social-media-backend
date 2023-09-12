import { InMemoryUsersRepository } from '@test/repositories/in-memory-user-repository';
import { CreateUserUseCase } from './create-user';
import { FakeHasher } from '@test/cryptography/fake-hasher';

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let createUserUseCase: CreateUserUseCase;

describe('create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();

    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository,
      fakeHasher,
    );
  });

  it('should be able to create a user', async () => {
    const result = await createUserUseCase.execute({
      email: 'johndoe@example.com',
      password: '12345678',
      username: 'johndoe',
      name: 'John Doe',
      photo: null,
      bio: null,
    });

    const hashedPassword = await fakeHasher.hash('12345678');

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryUsersRepository.users[0].password).toEqual(hashedPassword);
  });
});

it('should not be able to create a user and throw and error', async () => {
  const result = await createUserUseCase.execute({
    email: 'johndoe@example.com',
    password: '12345678',
    username: 'johndoe',
    name: 'John Doe',
    photo: null,
    bio: null,
  });

  expect(result.isLeft()).toBeTruthy();
  expect(inMemoryUsersRepository.users[1]).toBeUndefined();
});
