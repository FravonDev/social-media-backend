import { InMemoryUsersRepository } from '@test/repositories/in-memory-user-repository';
import { CreateUserUseCase } from './create-user';
import { FakeHasher } from '@test/cryptography/fake-hasher';
import { FakeMailService } from '@test/services/fake-mail.service';
import { GetCurrentUserProfileUseCase } from './get-current-user-profile';
import { makeUser } from '@test/factories/make-user';
import { UserSummary } from '@/app/entities/user';
import { UserNotFoundError } from '@/core/errors/shared/user-not-found';

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let createUserUseCase: CreateUserUseCase;
let getCurrentUserProfile: GetCurrentUserProfileUseCase;
let mailService: FakeMailService;
describe('Get current user profile summary User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    mailService = new FakeMailService();
    fakeHasher = new FakeHasher();
    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository,
      fakeHasher,
      mailService,
    );
    getCurrentUserProfile = new GetCurrentUserProfileUseCase(
      inMemoryUsersRepository,
    );
  });

  it('should be able to get current user profile summary', async () => {
    const johnny = makeUser({ name: 'Johnny J.', emailVerifiedAt: new Date() });
    const sarah = makeUser({ name: 'Sarah S.', emailVerifiedAt: new Date() });
    await inMemoryUsersRepository.users.push(johnny);
    await inMemoryUsersRepository.users.push(sarah);

    const result = await getCurrentUserProfile.execute({
      user_id: johnny.id.toString(),
    });

    const userSummary: UserSummary = {
      id: johnny.id.toString(),
      username: johnny.username,
      name: johnny.name,
      photo: johnny.photo,
    };

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toMatchObject(userSummary);
  });

  it('should be able to get current user profile summary', async () => {
    const johnny = makeUser({ name: 'Johnny J.', emailVerifiedAt: new Date() });
    const sarah = makeUser({ name: 'Sarah S.', emailVerifiedAt: new Date() });
    await inMemoryUsersRepository.users.push(johnny);
    await inMemoryUsersRepository.users.push(sarah);

    const result = await getCurrentUserProfile.execute({
      user_id: 'Non-existing user',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });
});
