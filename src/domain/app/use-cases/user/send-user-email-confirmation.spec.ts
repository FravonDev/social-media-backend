import { InMemoryUsersRepository } from '@test/repositories/in-memory-user-repository';
import { CreateUserUseCase } from './create-user';
import { FakeHasher } from '@test/cryptography/fake-hasher';
import { FakeMailService } from '@test/services/fake-mail.service';
import { makeUser } from '@test/factories/make-user';
import { ConfirmAccountUseCase } from './confirm-account';
import { SendUserEmailConfirmationUseCase } from './send-user-email-confirmation';
import { InMemoryConfirmationRepository } from '@test/repositories/in-memory-confirmation-repository';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryConfirmationRepository: InMemoryConfirmationRepository;
let fakeHasher: FakeHasher;
let createUserUseCase: CreateUserUseCase;
let mailService: FakeMailService;
let confirmEmailUseCase: SendUserEmailConfirmationUseCase;

describe('Send user email', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryConfirmationRepository = new InMemoryConfirmationRepository();
    mailService = new FakeMailService();
    fakeHasher = new FakeHasher();

    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository,
      fakeHasher,
      mailService,
    );
    confirmEmailUseCase = new SendUserEmailConfirmationUseCase(
      inMemoryUsersRepository,
      mailService,
      fakeHasher,
      inMemoryConfirmationRepository,
    );
  });

  it('should create a confirmation code', async () => {
    const user = makeUser({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('12345678'),
    });

    const result = await confirmEmailUseCase.execute({ email: user.email });
    expect(result.isRight()).toBeTruthy();
  });

  it('should not create a confirmation code if email already being used', async () => {
    const user = makeUser({
      email: 'jhondoe@test.com',
    });
    inMemoryUsersRepository.users.push(user);
    const result = await confirmEmailUseCase.execute({ email: user.email });
    console.log(result);
    expect(result.isLeft()).toBeTruthy();
  });
});
