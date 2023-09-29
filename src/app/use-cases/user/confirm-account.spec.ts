import { InMemoryUsersRepository } from '@test/repositories/in-memory-user-repository';
import { CreateUserUseCase } from './create-user';
import { FakeHasher } from '@test/cryptography/fake-hasher';
import { FakeMailService } from '@test/services/fake-mail.service';
import { makeUser } from '@test/factories/make-user';
import { ConfirmAccountUseCase } from './confirm-account';
import { isString } from 'class-validator';

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let createUserUseCase: CreateUserUseCase;
let confirmAccountUseCase: ConfirmAccountUseCase;
let mailService: FakeMailService;

describe('Confirm Account', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    mailService = new FakeMailService();
    fakeHasher = new FakeHasher();

    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository,
      fakeHasher,
      mailService,
    );
    confirmAccountUseCase = new ConfirmAccountUseCase(inMemoryUsersRepository);
  });

  it('should be able confirm account', async () => {
    const user = makeUser({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('12345678'),
    });

    inMemoryUsersRepository.users.push(user);
    const token = user.token as string;

    if (typeof token !== 'string') {
      fail('Token is not a string');
    }

    const result = await confirmAccountUseCase.execute({ token });
    expect(result.isRight()).toBeTruthy();
  });
});
