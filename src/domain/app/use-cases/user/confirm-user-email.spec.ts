import { InMemoryUsersRepository } from '@test/repositories/in-memory-user-repository';
import { CreateUserUseCase } from './create-user';
import { FakeHasher } from '@test/cryptography/fake-hasher';
import { FakeMailService } from '@test/services/fake-mail.service';
import { ConfirmUserEmailUseCase } from './confirm-user-email';
import { InMemoryConfirmationRepository } from '@test/repositories/in-memory-confirmation-repository';
import { MakeConfirmation } from '@test/factories/make-confirmation';
import { ResourceNotFoundError } from '@/core/errors/shared/resource-not-found';
import { CodeExpiredError } from './errors/code-expired-error';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryConfirmationRepository: InMemoryConfirmationRepository;
let fakeHasher: FakeHasher;
let createUserUseCase: CreateUserUseCase;
let confirmEmailUseCase: ConfirmUserEmailUseCase;
let mailService: FakeMailService;

describe('Confirm user email', () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryConfirmationRepository = new InMemoryConfirmationRepository();
    mailService = new FakeMailService();
    fakeHasher = new FakeHasher();

    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository,
      fakeHasher,
      mailService,
    );
    confirmEmailUseCase = new ConfirmUserEmailUseCase(
      inMemoryConfirmationRepository,
    );
  });

  it('should be able to confirm user email', async () => {
    const confirmation = MakeConfirmation({
      email: 'johndoe@example.com',
      code: '123456',
    });

    inMemoryConfirmationRepository.confirmations.push(confirmation);

    const result = await confirmEmailUseCase.execute({
      email: 'johndoe@example.com',
      code: confirmation.code,
    });

    expect(result.isRight()).toBeTruthy();
  });

  it('should trow resource not found error', async () => {
    const confirmation = MakeConfirmation({
      email: 'non-exintant-email@test.com',
      code: '123456',
    });
    inMemoryConfirmationRepository.confirmations.push(confirmation);

    const result = await confirmEmailUseCase.execute({
      email: 'johndoe@example.com',
      code: confirmation.code,
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should throw token expired error', async () => {
    const confirmation = MakeConfirmation({
      email: 'johndoe@example.com',
      code: '123456',
      expiresAt: new Date(Date.now() - 1000 * 60 * 5),
    });

    inMemoryConfirmationRepository.confirmations.push(confirmation);

    const result = await confirmEmailUseCase.execute({
      email: 'johndoe@example.com',
      code: confirmation.code,
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(CodeExpiredError);
  });
});
