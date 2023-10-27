import { FakeHasher } from 'test/cryptography/fake-hasher';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { InMemoryUsersRepository } from '@test/repositories/in-memory-user-repository';
import { AuthenticateUserUseCase } from './authenticate-user';
import { makeUser } from '@test/factories/make-user';
import { WrongCredentialsError } from './errors/wrong-credentials-error';

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let encrypter: FakeEncrypter;

let authenticateUserUseCase: AuthenticateUserUseCase;

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    encrypter = new FakeEncrypter();

    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository,
      fakeHasher,
      encrypter,
    );
  });

  it('should be able to authenticate a user', async () => {
    const user = makeUser({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('12345678'),
    });

    inMemoryUsersRepository.users.push(user);

    const result = await authenticateUserUseCase.execute({
      email: 'johndoe@example.com',
      password: '12345678',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      id: user.id.toString(),
      name: user.name,
      username: user.username,
      photo: user.photo,
      accessToken: expect.any(String),
    });
  });

  it('should throw a WrongCredentialsError when email are incorrect', async () => {
    const result = await authenticateUserUseCase.execute({
      email: 'wrongemail@example.com',
      password: '12345678',
    });
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });

  it('should throw a WrongCredentialsError when password are incorrect', async () => {
    const result = await authenticateUserUseCase.execute({
      email: 'johndoe@example.com',
      password: 'wrongpassword',
    });
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });
});
