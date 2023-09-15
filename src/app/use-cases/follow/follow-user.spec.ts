import { InMemoryUsersRepository } from '@test/repositories/in-memory-user-repository';
import { FollowUserUseCase } from './follow-user';
import { InMemoryFollowsRepository } from '@test/repositories/in-memory-follows-repository';
import { makeUser } from '@test/factories/make-user';
import { CreateUserUseCase } from '../user/create-user';
import { FakeHasher } from '@test/cryptography/fake-hasher';
import { Follow } from '@/app/entities/follow';
import { UserNotFoundError } from '@/core/errors/shared/user-not-found';
import { AlreadyFollowUserError } from './errors/already-follow';

describe('Follow User', () => {
  let inMemoryFollowsRepository: InMemoryFollowsRepository;
  let inMemoryUsersRepository: InMemoryUsersRepository;

  let fakeHasher: FakeHasher;

  let followUserUseCase: FollowUserUseCase;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();

    inMemoryFollowsRepository = new InMemoryFollowsRepository();

    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository,
      fakeHasher,
    );

    followUserUseCase = new FollowUserUseCase(
      inMemoryFollowsRepository,
      inMemoryUsersRepository,
    );
  });

  it('should be able to follow a user', async () => {
    const johnny = makeUser({ name: 'Johnny J.' });
    const sarah = makeUser({ name: 'Sarah S.' });

    await createUserUseCase.execute(johnny);
    await createUserUseCase.execute(sarah);

    const johnnyresult = await inMemoryUsersRepository.findByUsername(
      johnny.username,
    );
    const sarahresult = await inMemoryUsersRepository.findByUsername(
      sarah.username,
    );

    if (johnnyresult && sarahresult) {
      const result = await followUserUseCase.execute({
        followerId: johnnyresult.id.toString(),
        username: sarahresult.username,
      });

      expect(result.isRight()).toBeTruthy();
      expect(result.value).toBeInstanceOf(Follow);
    } else {
      fail('User not found.');
    }
  });

  it('should throw AlreadyFollowUserError when trying to follow a user that is already followed', async () => {
    const johnny = makeUser({ name: 'Johnny J.' });
    const sarah = makeUser({ name: 'Sarah S.' });

    await createUserUseCase.execute(johnny);
    await createUserUseCase.execute(sarah);

    const johnnyresult = await inMemoryUsersRepository.findByUsername(
      johnny.username,
    );
    const sarahresult = await inMemoryUsersRepository.findByUsername(
      sarah.username,
    );

    if (johnnyresult && sarahresult) {
      await followUserUseCase.execute({
        followerId: johnnyresult.id.toString(),
        username: sarahresult.username,
      });

      const result2 = await followUserUseCase.execute({
        followerId: johnnyresult.id.toString(),
        username: sarahresult.username,
      });
      console.log(result2);
      expect(result2.isLeft()).toBeTruthy();
      expect(result2.value).toBeInstanceOf(AlreadyFollowUserError);
    } else {
      fail('User not found.');
    }
  });

  it('should throw UserNotFoundError when trying to follow a nonexistent user', async () => {
    const johnny = makeUser({ name: 'Johnny J.' });
    await createUserUseCase.execute(johnny);

    const result = await followUserUseCase.execute({
      followerId: johnny.id.toString(),
      username: 'non-existent-user-username',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });
});
