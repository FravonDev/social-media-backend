import { InMemoryUsersRepository } from '@test/repositories/in-memory-user-repository';
import { CreateUserUseCase } from './create-user';
import { FakeHasher } from '@test/cryptography/fake-hasher';
import { EmailAlreadyExistsError } from './errors/email-already-exists';
import { UsernameAlreadyExistsError } from './errors/username-already-exists';

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

it('should throw EmailAlreadyExistsError if email already exists', async () => {
  const result = await createUserUseCase.execute({
    email: 'johndoe@example.com',
    password: '12345678',
    username: 'johndoe',
    name: 'John Doe',
    photo: null,
    bio: null,
  });

  expect(result.isLeft()).toBeTruthy();
  expect(result.value).toBeInstanceOf(EmailAlreadyExistsError);
  expect(inMemoryUsersRepository.users[1]).toBeUndefined();
});

it('should throw UsernameAlreadyExistsError if username already exists', async () => {
  const result = await createUserUseCase.execute({
    email: 'john2@example.com',
    password: '12345678',
    username: 'johndoe',
    name: 'John Doe',
    photo: null,
    bio: null,
  });

  expect(result.isLeft()).toBeTruthy();
  expect(result.value).toBeInstanceOf(UsernameAlreadyExistsError);
  expect(inMemoryUsersRepository.users[1]).toBeUndefined();
});
